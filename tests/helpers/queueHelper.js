import { Queue, QueueEvents } from 'bullmq';

/**
 * Wait for a job to complete or fail
 */
export async function waitForJob(queue, jobId, timeout = 10000) {
    const idStr = String(jobId);
    const queueEvents = new QueueEvents(queue.name, {
        connection: queue.opts.connection,
    });

    // CRITICAL: Wait for QueueEvents to be ready
    await queueEvents.waitUntilReady();

    return new Promise((resolve, reject) => {
        const timer = setTimeout(async () => {
            try {
                const job = await queue.getJob(idStr);
                if (job) {
                    const state = await job.getState();
                    if (state === 'completed') {
                        const returnvalue = await job.returnvalue;
                        await queueEvents.close();
                        return resolve({
                            status: 'completed',
                            result: returnvalue,
                        });
                    }
                    if (state === 'failed') {
                        await queueEvents.close();
                        return resolve({
                            status: 'failed',
                            error: job.failedReason,
                        });
                    }
                }
            } catch (err) {
                // Ignore
            }
            await queueEvents.close();
            reject(new Error(`Job ${idStr} timed out`));
        }, timeout);

        queueEvents.on(
            'completed',
            async ({ jobId: completedId, returnvalue }) => {
                if (String(completedId) === idStr) {
                    clearTimeout(timer);
                    await queueEvents.close();
                    resolve({ status: 'completed', result: returnvalue });
                }
            },
        );

        queueEvents.on('failed', async ({ jobId: failedId, failedReason }) => {
            if (String(failedId) === idStr) {
                clearTimeout(timer);
                await queueEvents.close();
                resolve({ status: 'failed', error: failedReason });
            }
        });
    });
}

/**
 * Clean all jobs from queue
 */
export async function cleanQueue(queue) {
    await queue.obliterate({ force: true });
}

/**
 * Get job counts
 */
export async function getJobCounts(queue) {
    return {
        waiting: await queue.getWaitingCount(),
        active: await queue.getActiveCount(),
        completed: await queue.getCompletedCount(),
        failed: await queue.getFailedCount(),
        delayed: await queue.getDelayedCount(),
    };
}
