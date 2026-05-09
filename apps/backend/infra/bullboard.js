import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@theblogproj/config';

export function setupBullBoard(app, { blogQueue, deadLetterQueue }) {
    // ⚠️ Only enable in development
    if (config.nodeEnv === 'production') {
        console.log('⚠️  BullBoard disabled in production');
        return;
    }

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/ops/queues');

    const queues = [new BullMQAdapter(blogQueue)];

    if (deadLetterQueue) {
        queues.push(new BullMQAdapter(deadLetterQueue));
    }

    createBullBoard({
        queues,
        serverAdapter,
    });

    app.use('/ops/queues', serverAdapter.getRouter());
    console.log('📊 BullBoard available at /ops/queues (dev only)');
}
