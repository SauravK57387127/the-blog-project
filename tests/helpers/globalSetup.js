import { execSync } from 'child_process';
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
  // Skip Docker compose in CI — GitHub Actions provides services directly
  if (!process.env.CI) {  
  loadEnvFile(resolve(process.cwd(), '.env.test'));

    console.log('\n🐳 Starting test containers...');
    execSync('docker compose -f docker-compose.test.yml up -d --wait', {
        stdio: 'inherit',
    });
    console.log('✅ Test containers ready');

    console.log('🔄 Running Prisma migrations...');
    execSync('pnpm db:migrate:e2e', {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' },
    });
  
    console.log('✅ Migrations done');
  }
}
