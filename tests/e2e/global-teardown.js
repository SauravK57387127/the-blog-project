import { execSync } from 'child_process';

export default async function globalTeardown() {
  // Stop backend
  const pid = process.env.E2E_BACKEND_PID;
  if (pid) {
    try {
      process.kill(parseInt(pid), 'SIGTERM');
      console.log('✅ Backend stopped');
    } catch (e) {
      // Already stopped
    }
  }

  // Stop E2E containers
  console.log('🐳 Stopping E2E containers...');
  execSync('docker compose -f docker-compose.e2e.yml down', {
    stdio: 'inherit',
  });
  console.log('✅ E2E containers stopped');
}
