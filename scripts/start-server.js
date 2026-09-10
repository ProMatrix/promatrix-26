const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const firebaseCli = path.join(repoRoot, 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
const angularCli = path.join(repoRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const functionsNode = path.join(
  repoRoot,
  'functions',
  'node_modules',
  'node',
  'bin',
  process.platform === 'win32' ? 'node.exe' : 'node',
);
const functionsDiscoveryTimeoutSeconds = '30';
const firebaseProjectId = 'demo-promatrix-us';
const hostingHost = '127.0.0.1';
const defaultHostingPort = 4200;

for (const [name, filePath, installHint] of [
  ['local firebase-tools', firebaseCli, 'Run npm.cmd install from the project root.'],
  ['local Angular CLI', angularCli, 'Run npm.cmd install from the project root.'],
  [
    'local Firebase Functions SDK',
    path.join(repoRoot, 'functions', 'node_modules', 'firebase-functions', 'package.json'),
    'Run npm.cmd run npm-functions from the project root.',
  ],
  [
    'local Firebase Admin SDK',
    path.join(repoRoot, 'functions', 'node_modules', 'firebase-admin', 'package.json'),
    'Run npm.cmd run npm-functions from the project root.',
  ],
  [
    'local Node 22 Functions runtime',
    functionsNode,
    'Run npm.cmd run npm-functions from the project root.',
  ],
]) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${name}. ${installHint}`);
    process.exit(1);
  }
}

const functionsCommand = {
  name: 'functions',
  command: functionsNode,
  cleanNpmLifecycleEnv: true,
  env: {
    FUNCTIONS_EMULATOR: 'true',
    FUNCTIONS_DISCOVERY_TIMEOUT: functionsDiscoveryTimeoutSeconds,
  },
  args: [
    '--no-deprecation',
    firebaseCli,
    'emulators:start',
    '--config',
    'firebase.json',
    '--only',
    'functions',
    '--project',
    firebaseProjectId,
  ],
};

const functionsReadyPattern = /All emulators ready|functions:.*listening/i;

const children = [];
let stopping = false;
let hostingStarted = false;
let hostingCommand;

function createChildEnv(command) {
  const env = {
    ...process.env,
    ...command.env,
  };

  if (command.cleanNpmLifecycleEnv) {
    for (const key of Object.keys(env)) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey.startsWith('npm_') || normalizedKey === 'init_cwd') {
        delete env[key];
      }
    }
  }

  return env;
}

function removeChild(child) {
  const index = children.indexOf(child);
  if (index >= 0) {
    children.splice(index, 1);
  }
}

function startCommand(command) {
  console.log(`[${command.name}] starting`);
  const child = spawn(command.command, command.args, {
    cwd: repoRoot,
    env: createChildEnv(command),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  });

  children.push(child);

  child.on('error', (error) => {
    console.error(`[${command.name}] ${error.message}`);
    stopChildren();
    process.exitCode = 1;
  });

  child.on('exit', (code, signal) => {
    removeChild(child);

    if (stopping) {
      return;
    }

    console.error(`[${command.name}] exited with ${signal || code}`);
    stopChildren();
    process.exitCode = code ?? 1;
  });

  return child;
}

function createHostingCommand(port) {
  return {
    name: 'hosting',
    command: process.execPath,
    cleanNpmLifecycleEnv: true,
    args: [angularCli, 'serve', '--host', hostingHost, '--port', String(port)],
  };
}

function getPreferredHostingPort() {
  const rawPort = process.env.PROMATRIX_HOSTING_PORT;

  if (!rawPort) {
    return defaultHostingPort;
  }

  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error(`PROMATRIX_HOSTING_PORT must be an integer from 1024 through 65535, received ${rawPort}.`);
  }

  return port;
}

function canListenOnPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.unref();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen({ host: hostingHost, port });
  });
}

async function findHostingPort(preferredPort) {
  const lastPort = Math.min(preferredPort + 20, 65535);

  for (let port = preferredPort; port <= lastPort; port += 1) {
    if (await canListenOnPort(port)) {
      return port;
    }
  }

  throw new Error(`No available hosting port found from ${preferredPort} through ${lastPort}.`);
}

function prefixStream(stream, prefix, onText) {
  let pending = '';

  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    onText?.(chunk);

    pending += chunk.replace(/\r/g, '\n');
    const lines = pending.split('\n');
    pending = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim()) {
        console.log(`[${prefix}] ${line}`);
      }
    }
  });

  stream.on('end', () => {
    if (pending.trim()) {
      console.log(`[${prefix}] ${pending}`);
    }
  });
}

function stopChildren(signal = 'SIGTERM') {
  if (stopping) {
    return;
  }

  stopping = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

function startHostingAfterFunctionsReady(line) {
  if (hostingStarted || !functionsReadyPattern.test(line)) {
    return;
  }

  if (!hostingCommand) {
    console.error('[hosting] hosting command was not initialized');
    stopChildren();
    process.exitCode = 1;
    return;
  }

  hostingStarted = true;
  console.log(`[${hostingCommand.name}] starting after ${functionsCommand.name} reported ready`);
  const hosting = startCommand(hostingCommand);
  prefixStream(hosting.stdout, hostingCommand.name);
  prefixStream(hosting.stderr, hostingCommand.name);
}

async function main() {
  const preferredHostingPort = getPreferredHostingPort();
  const hostingPort = await findHostingPort(preferredHostingPort);

  if (hostingPort !== preferredHostingPort) {
    console.log(`[hosting] port ${preferredHostingPort} is in use; using ${hostingPort}`);
  }

  hostingCommand = createHostingCommand(hostingPort);

  const functions = startCommand(functionsCommand);
  prefixStream(functions.stdout, functionsCommand.name, startHostingAfterFunctionsReady);
  prefixStream(functions.stderr, functionsCommand.name, startHostingAfterFunctionsReady);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  stopChildren();
  process.exitCode = 1;
});

process.on('SIGINT', () => stopChildren('SIGINT'));
process.on('SIGTERM', () => stopChildren('SIGTERM'));