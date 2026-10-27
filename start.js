import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🌟 Starting Backend and Frontend Servers...');

// Start Backend Server
const backend = spawn('node', ['server/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start Frontend Server (Vite)
const frontend = spawn('npx', ['vite', '--host'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => console.error('Backend Error:', err));
frontend.on('error', (err) => console.error('Frontend Error:', err));

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
