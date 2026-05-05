import mongoose from 'mongoose';

const BlogViewSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
        index: true,
    },

    sessionId: {
        type: String,
        required: true,
        index: true,
    },

    userId: String, // Clerk userId if logged in

    // Metrics
    timeSpent: {
        type: Number,
        default: 0,
    },

    scrollDepth: {
        type: Number,
        default: 0,
    },

    completed: {
        type: Boolean,
        default: false,
    },

    // Context
    referrer: String,
    device: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown',
    },

    viewedAt: {
        type: Date,
        default: Date.now,
        index: true,
    },

    exitedAt: {
        type: Date,
        default: null,
    },
});

// Unique view per session per blog
BlogViewSchema.index({ blogId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model('BlogView', BlogViewSchema);
