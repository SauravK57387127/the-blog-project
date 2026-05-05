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

export async function seedE2EData() {
    loadEnvFile(resolve(process.cwd(), '.env.e2e'));

    const { connectMongo } = await import('../../../database/mongo/connect.js');
    const { connectPostgres } = await import(
        '../../../database/postgres/connect.js'
    );
    const { models } = await import('../../../database/index.js');
    const { getPrisma } = await import('../../../database/postgres/connect.js');
    const { hashPassword } = await import(
        '../../../apps/backend/src/utils/adminAuth.js'
    );

    await connectMongo();
    await connectPostgres();

    const { Blog, BlogAnalytics, Author } = models;
    const prisma = getPrisma();

    // Clear existing e2e data
    await Promise.all([
        Blog.deleteMany({}),
        BlogAnalytics.deleteMany({}),
        Author.deleteMany({}),
    ]);
    await prisma.adminRefreshToken.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.admin.deleteMany();

    // Create author
    await Author.create({
        name: 'Saurav Kumar',
        bio: 'Full-stack developer',
        profileImage: null,
        isActive: true,
    });

    // Create 5 published blogs
    const blogs = [];
    for (let i = 1; i <= 5; i++) {
        const blog = await Blog.create({
            title: `E2E Test Blog ${i}`,
            slug: `e2e-test-blog-${i}`,
            content: `<p>Content for E2E test blog ${i}. This is meaningful content.</p>`,
            excerpt: `Excerpt for E2E blog ${i}`,
            tags: ['javascript', 'testing'],
            category: 'tech-deep-dive',
            status: 'published',
            publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            readingTime: 5,
            authorId: 'single-author',
        });

        await BlogAnalytics.create({
            blogId: blog._id,
            totalViews: i * 10,
            views7d: i * 5,
            views30d: i * 10,
            views180d: i * 20,
        });

        blogs.push(blog);
    }

    // Create admin account for E2E admin flows
    await prisma.admin.create({
        data: {
            username: 'e2e-admin',
            passwordHash: await hashPassword('E2ePassword123!'),
            role: 'admin',
            failedAttempts: 0,
        },
    });

    console.log('✅ E2E seed complete');
    return { blogs };
}
