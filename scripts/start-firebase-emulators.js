const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const firebaseCli = path.join(repoRoot, 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
const functionsDiscoveryTimeoutSeconds = '30';

if (!fs.existsSync(firebaseCli)) {
  console.error('Missing local firebase-tools. Run npm.cmd install from the project root.');
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    '--no-deprecation',
    firebaseCli,
    'emulators:start',
    '--config',
    'firebase.json',
    '--only',
    'hosting,functions',
    '--project',
    'promatrix-us',
    ...process.argv.slice(2),
  ],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      FUNCTIONS_EMULATOR: 'true',
      FUNCTIONS_DISCOVERY_TIMEOUT: functionsDiscoveryTimeoutSeconds,
    },
    stdio: 'inherit',
    shell: false,
  },
);

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});