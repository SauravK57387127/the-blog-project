import { execSync } from 'child_process';

export default async function globalTeardown() {
  console.log('\n🐳 Stopping test containers...');
  
  execSync(
    'docker compose -f docker-compose.test.yml down',
    { stdio: 'inherit' }
  );

  console.log('✅ Test containers stopped');
}
