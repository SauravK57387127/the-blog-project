import { Worker } from "bullmq";
import {JobLogger} from './jobLogger.js'
import {RetryableError, FatalError} from './errors.js'

/**
 * Factory to create a Blog Worker with Production Patterns
 * @param {object} redisConnection - ioredis connection
 * @param {object} Blog - Mongoose Blog Model
 * @param {Queue} deadLetterQueue - Queue for failed jobs (optional)
 * @returns {Worker}
 */
export function createBlogWorker(redisConnection, Blog, deadLetterQueue = null) {
  const worker = new Worker(
    "blogQueue",
    async (job) => {
      const jobLogger = new JobLogger(job);
      const startTime = Date.now();
      
      try {
        jobLogger.info('Job started', {data: job.data})

        // Route to appropriate handler
        if (job.name == 'publish-blog') {
          return await handlePublishBlog(job, Blog, jobLogger);
        } else if (job.name === 'reconcile-blogs') {
          return await handleReconcileBlogs(Blog, jobLogger)
        } else {
          throw new FatalError(`Unknown job type: ${job.name}`)
        }

        const duration = Date.now() - startTime;
        jobLogger.info('Job completed', {duration})

      } catch (error) {
        const duration = Date.now() - startTime;
        jobLogger.error('Job failed', error, { duration });

        // Re-throw to let BullMQ handle retry logic
        throw error;
      }
    },
    { 
      connection: redisConnection,
      concurrency: 5,

      // Job settings
      settings: {
        lockDuration: 30000,
        maxStalledCount: 2,   // After 2 stalls, move to failed
      }
    }
  );


  // DLQ: Listen for permanently failed blogs
  if (deadLetterQueue) {
    worker.on('failed', async (job, error) => {
      // Only move to DLQ if job exhausted all retries
      if (job.attemptsMade >= job.opts.attempts) {
        try {
          await deadLetterQueue.add('failed-job', {
            originalJobId: job.id,
            originalJobName: job.name,
            originalData: job.data,
            failedAt: new Date(),
            error: {
              message: error.message,
              type: error.constructor.name,
              stack: error.stack,
            },
            attempts: job.attemptsMade,
          });

          const jobLogger = new JobLogger(job);
          jobLogger.warn('Job moved to Dead Letter Queue', {
            dlqJobId: job.id,
            reason: error.message,
          });
        } catch (dlqError) {
          console.error('❌ Failed to add job to DLQ:', dlqError);
        }
      }
    })
  }

  return worker;
}


/**
 * Handler: Publish a blog
 */
async function handlePublishBlog(job, Blog, jobLogger) {
  const {blogId} = job.data;

  if (!blogId) {
    throw new FatalError("Missing blogId in job data")
  }

  try {
    // Fetch data
    const blog = await Blog.findById(blogId);

    if (!blog){
      jobLogger.warn('Blog not found', {blogId})
      return {status: 'blog_not_found', blogId}
    }

    // IDEMPOTENCY CHECK
    if (blog.status === 'published') {
      jobLogger.info('Blog already published', {
        blogId,
        publishedAt: blog.publishedAt
      });
      return {status: 'already_published', blogId}
    }

    // Only publish if scheduled
    if (blog.status !== 'scheduled'){
      jobLogger.warn('Blog status changed', {blogId, currentStatus: blog.status});
      return {status: 'status_changed', blogId, currentStatus: blog.status};
    }     
    blog.status = 'published';
    blog.publishedAt = new Date();
    await Blog.findByIdAndUpdate(
  blogId,
  { status: 'published', publishedAt: new Date() },
  { runValidators: false }
);
    return {status: 'published', blogId, title: blog.title};
    
  } catch (error) {
    if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      throw new RetryableError('Database connection failed', { blogId, error: error.message });
    }

    if (error.name === 'ValidationError') {
      throw new FatalError('Blog validation failed', { blogId, error: error.message });
    }

    // Unknown error - retry by default
    throw new RetryableError(error.message, { blogId });
  }
}


/**
 * Handler: Reconcile overdue scheduled blogs
 */
async function handleReconcileBlogs(Blog, jobLogger){
  try {
    const now = Date.now();
    const overdue = await Blog.find({
      status: 'scheduled',
      scheduledAt: {$lte: now}
    })

    if (overdue.length === 0) {
      jobLogger.info('No overdue blogs to reconcile');
      return {status: 'no_overdue', count: 0}
    }

    let publishedCount = 0;
    for (const blog of overdue){
      // Skip if already published
      if (blog.status === 'published'){
        continue;
      }

      await Blog.findByIdAndUpdate(
    blog._id,
    { status: 'published', publishedAt: new Date() },
    { runValidators: false }
  );
      publishedCount++;

      jobLogger.info('Reconcile overdue blog', {
        blogId: blog._id, 
        title: blog.title
      })
    }

    return {status: 'reconciled', count: publishedCount}
  
  } catch (error) {
    if (error.name === 'MongoNetworkError') {
      throw new RetryableError('Database connection failed during reconciliation');
    }
    throw error;
  }
}
