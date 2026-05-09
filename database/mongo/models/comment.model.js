import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
            maxlength: 2000,
        },

        // For nested comments
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
            index: true,
        },

        // Metadata
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

// Indexes for efficient querying
CommentSchema.index({ blogId: 1, parentId: 1, createdAt: -1 });
CommentSchema.index({ blogId: 1, createdAt: -1 });

// Virtual: Check if this is a top-level comment
CommentSchema.virtual('isTopLevel').get(function () {
    return this.parentId === null;
});

export default mongoose.model('Comment', CommentSchema);
