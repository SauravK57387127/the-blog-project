import { Worker } from 'bullmq';
import { getRedis } from '../../../database/redis/redisClient';
import Blog from '../../../database/models/blog.model.js';


new Worker('blogQueue', async (job) => {
    try {
        const { blogId } = job.data;
        const blog = await Blog.findById(blogId);

        if (blog && blog.status === 'scheduled') {
            blog.status = 'published';
            blog.publishedAt = new Date();
            await blog.save();
            console.log(`✅ Blog published: ${blog.title}`);
        } else {
            console.log(`⚠️ Blog not found or not in scheduled state: ${blogId}`);
        }
    } catch (error) {
        console.error(`❌ Error processing job ${job.id}:`, error);
        // Optional: Add more robust error handling, like retrying the job
    }
}, {
    connection: getRedis(),
});


