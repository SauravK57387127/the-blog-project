import { Queue } from "bullmq";

/**
 * Factory to create Dead Letter Queue
 * Jobs that fail after max retries go here for manual inspection
 */
export function createDeadLetterQueue(redisConnection) {
  return new Queue("deadLetterQueue", { 
    connection: redisConnection 
  });
}
