import { execSync } from 'child_process';

export default async function globalSetup() {
  console.log('\n🐳 Starting test containers...');
  
  execSync(
    'docker compose -f docker-compose.test.yml up -d --wait',
    { stdio: 'inherit' }
  );

  console.log('✅ Test containers ready');
}
