import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from '@theblogproj/config';

if (config.sentry.enabled) {
    Sentry.init({
        dsn: config.sentry.dsn,
        environment: config.sentry.environment,
        tracesSampleRate: config.sentry.tracesSampleRate,
        profilesSampleRate: config.sentry.tracesSampleRate,

        integrations: [
            Sentry.expressIntegration(),
            Sentry.httpIntegration({ tracing: true }),
            nodeProfilingIntegration(),
            // send console.log, console.warn, and console.error calls as logs to Sentry
            Sentry.consoleLoggingIntegration({
                levels: ['log', 'warn', 'error'],
            }),
        ],

        beforeSend(event) {
            if (event.level === 'log' || event.level === 'info') return null;
            return event;
        },

        initialScope: {
            tags: {
                nodejs_version: process.version,
            },
        },

        enableLogs: true,
    });
}
