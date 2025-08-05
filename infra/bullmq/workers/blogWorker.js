import { Worker } from 'bullmq';
import { getRedis } from '../../../database/redis/redisClient';
import Blog from '../../../database/models/blog.model.js';
// import AdminEmailService from '../../../apps/backend/src/services/admin/email.service.js';




new Worker('blogQueue', async (job) => {
    const { blogId } = job.data;

    const blog = Blog.findById(blogId);
    if(blog && blog.status === 'scheduled') {
        blog.status = 'published'
        blog.publishedAt = new Date()
        await blog.save();
    }

    // AdminEmailService.sendEmailToAdmin(blog)             // LATER: after blog found to be scheduled
    // AdminEmailService.sendEmailToUsers(blog)
}, {
    connection: getRedis(),
})

