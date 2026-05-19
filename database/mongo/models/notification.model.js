import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        // Who receives the notification
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Who triggered it
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Related blog
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
        },

        // Type
        type: {
            type: String,
            enum: ['reply', 'like_comment', 'comment'],
            required: true,
            index: true,
        },

        // For reply notifications
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },

        replyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },

        // Preview text
        commentPreview: {
            type: String,
            maxlength: 200,
        },

        // Status
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        readAt: Date,

        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: false,
    },
);

// Compound indexes
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);
