import { execSync, spawn } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile(envPath) {
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

export default async function globalSetup() {
  loadEnvFile(resolve(process.cwd(), '.env.e2e'));

  // Start E2E containers
  console.log('🐳 Starting E2E containers...');
  execSync('docker compose -f docker-compose.e2e.yml up -d --wait', {
    stdio: 'inherit',
  });
  console.log('✅ E2E containers ready');

  // Run migrations
  console.log('🔄 Running migrations...');
  execSync('pnpm --filter database prisma:migrate:deploy', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'e2e' },
  });
  console.log('✅ Migrations done');

  // Seed E2E data
  console.log('🌱 Seeding E2E data...');
  const { seedE2EData } = await import('./fixtures/seed.js');
  await seedE2EData();
  console.log('✅ E2E data seeded');

  // Start backend
  console.log('🚀 Starting backend...');
  const backend = spawn(
    'node',
    ['--dns-result-order=ipv4first', 'src/server.js'],
    {
      cwd: resolve(process.cwd(), 'apps/backend'),
      env: { ...process.env, NODE_ENV: 'e2e' },
      stdio: 'pipe',
    }
  );

  // Wait for backend to be ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Backend start timeout')), 30000);
    
backend.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('🟦 Backend stdout:', output);  // ← add this
  if (output.includes('Server running')) {
    clearTimeout(timeout);
    resolve();
  }
}); 

   backend.stderr.on('data', (data) => {
  console.error('🔴 Backend stderr:', data.toString());
});




    backend.on('error', reject);
  });

  // Store backend process for teardown
  process.env.E2E_BACKEND_PID = backend.pid.toString();
console.log('🔍 Waiting for backend to accept connections...');
await new Promise((resolve, reject) => {
  const maxWait = 30000; // 30s max
  const start = Date.now();

  const checkHealth = async () => {
    if (Date.now() - start > maxWait) {
      return reject(new Error('Backend health check timed out after 30s'));
    }
    try {
      const res = await fetch('http://localhost:7000/health');
      if (res.ok) return resolve();
    } catch {
      // not ready yet
    }
    setTimeout(checkHealth, 500);
  };

  checkHealth();
});
console.log('✅ Backend ready');

}
