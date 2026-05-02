import { models } from '../../../database/index.js';

const { Blog } = models;

export async function createBlog(overrides = {}) {
  const blog = await Blog.create({
    title: 'Test Blog Post',
    slug: `test-blog-${Date.now()}`,
    excerpt: 'A test excerpt',
    content: '<p>Test content</p>',
    coverImage: 'https://example.com/image.jpg',
    tags: ['test'],
    category: 'tech',
    status: 'published',
    readingTime: 5,
    publishedAt: new Date(),
    ...overrides,
  });
  return blog;
}
