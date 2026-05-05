/**
 * Retryable errors
 */
export class RetryableError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'RetryableError';
        this.retryable = true;
        this.details = details;
    }
}

/**
 * Fatal Errors
 */
export class FatalError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'FatalError';
        this.retryable = false;
        this.details = details;
    }
}
