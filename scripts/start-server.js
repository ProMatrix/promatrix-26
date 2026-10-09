const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const angularCli = path.join(repoRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const hostingHost = '127.0.0.1';
const defaultHostingPort = 4200;

for (const [name, filePath, installHint] of [
  ['local Angular CLI', angularCli, 'Run npm.cmd install from the project root.'],
]) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${name}. ${installHint}`);
    process.exit(1);
  }
}

const children = [];
let stopping = false;

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

async function main() {
  const preferredHostingPort = getPreferredHostingPort();
  const hostingPort = await findHostingPort(preferredHostingPort);

  if (hostingPort !== preferredHostingPort) {
    console.log(`[hosting] port ${preferredHostingPort} is in use; using ${hostingPort}`);
  }

  const hostingCommand = createHostingCommand(hostingPort);
  const hosting = startCommand(hostingCommand);
  prefixStream(hosting.stdout, hostingCommand.name);
  prefixStream(hosting.stderr, hostingCommand.name);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  stopChildren();
  process.exitCode = 1;
});

process.on('SIGINT', () => stopChildren('SIGINT'));
process.on('SIGTERM', () => stopChildren('SIGTERM'));