import {logger} from '../../logger/index.js';

export class JobLogger {
  constructor(job) {
    this.jobId = job.id;
    this.jobName = job.name;
    this.attemptsMade = job.attemptsMade
  }

  info(message, details = {}){
    logger.info({
      jobId: this.jobId,
      jobName: this.jobName,
      attempt: this.attemptsMade,
      ...details
    })
  }

  error(message, error, data = {}) {
    logger.error({
      jobId: this.jobId,
      jobName: this.jobName,
      attempt: this.attemptsMade,
      error: error.message,
      stack: error.stack,
      errorType: error.constructor.name,
      ...data
    })
  }

  warn(message, data = {}) {
    logger.warn({
      jobId: this.jobId,
      jobName: this.jobName,
      attempt: this.attemptsMade,
      ...data
    })
  }
}
