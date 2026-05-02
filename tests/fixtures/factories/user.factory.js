import { models } from '../../../database/index.js';

const { User } = models;

export async function createUser(overrides = {}) {
  return User.create({
    clerkUserId: `clerk_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    email: `user_${Date.now()}@test.com`,
    name: 'Test User',
    profileImage: null,
    ...overrides,
  });
}
