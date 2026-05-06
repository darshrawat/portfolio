const { spawn } = require('child_process');
const path = require('path');

const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

// Run Next.js in a separate process group (detached) so it doesn't receive
// standard Windows terminal Ctrl+C console broad-signals.
const start = spawn('node', [nextPath, 'start'], {
  stdio: 'pipe',
  shell: false,
  detached: true
});

start.stdout.on('data', (data) => {
  process.stdout.write(data);
});

start.stderr.on('data', (data) => {
  process.stderr.write(data);
});

const killChild = () => {
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/T', '/PID', start.pid.toString()], { shell: true });
    } else {
      start.kill();
    }
  } catch (e) {}
};

process.on('SIGINT', () => {
  killChild();
  process.exit(0);
});

process.on('SIGTERM', () => {
  killChild();
  process.exit(0);
});

start.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code || 0);
});
