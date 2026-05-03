import { getPrisma } from '../../../database/index.js';
import { hashPassword } from '../../../apps/backend/src/utils/adminAuth.js';

export async function createAdmin(overrides = {}) {
  const prisma = getPrisma();
  const password = overrides.password || 'TestPassword123!';
  
  return prisma.admin.create({
    data: {
      username: `admin_${Date.now()}`,
      passwordHash: await hashPassword(password),
      role: 'admin',
      failedAttempts: 0,
      ...overrides,
      password: undefined, // don't pass plain password to prisma
    },
  });
}
