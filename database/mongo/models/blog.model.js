import mongoose from 'mongoose';

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
        draftSlug: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        coverImage: String,
        excerpt: {
            type: String,
            maxlength: 300,
        },
        tags: [
            {
                type: String,
                lowercase: true,
                trim: true,
            },
        ],
        category: {
            type: String,
            enum: [
                'tech-deep-dive',
                'life-and-growth',
                'career-and-learnings',
                'experiments',
                '',
            ],
            default: '',
            index: true,
        },
        readingTime: {
            type: Number,
            default: 5,
        },
        authorId: {
            type: String,
            required: true,
            default: 'single-author',
        },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'published'],
            default: 'draft',
            index: true,
        },
        publishedAt: Date,
        scheduledAt: Date,
        autosaveAt: Date,
        wordCount: {
            type: Number,
            default: 0,
        },
        editorsPick: {
            isEditorsPick: {
                type: Boolean,
                default: false,
                index: true,
            },
            annotation: {
                type: String,
                maxlength: 200,
            },
            pickOrder: {
                type: Number,
                min: 1,
                max: 4,
            },
            pickedAt: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

BlogSchema.index(
    { title: 'text', content: 'text', excerpt: 'text' },
    {
        weights: { title: 10, excerpt: 5, content: 1 },
        name: 'blog_text_search',
    },
);

BlogSchema.index({ status: 1, category: 1, publishedAt: -1 });
BlogSchema.index({ status: 1, tags: 1, publishedAt: -1 });
BlogSchema.index({ status: 1, publishedAt: -1 });

BlogSchema.virtual('isDraft').get(function () {
    return this.status === 'draft';
});

BlogSchema.virtual('isPublished').get(function () {
    return this.status === 'published';
});

export default mongoose.model('Blog', BlogSchema);
