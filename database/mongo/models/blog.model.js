import mongoose from 'mongoose';

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

<<<<<<< HEAD
=======
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const plainText = content
        .replace(/<[^>]*>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const wordCount = plainText.length > 0 
        ? plainText.split(' ').filter(w => w.length > 0).length 
        : 0;
    return Math.ceil(wordCount / wordsPerMinute);
}

>>>>>>> main
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

<<<<<<< HEAD
=======
// ========== METHODS ========== ← ADD HERE
BlogSchema.methods.publish = function () {
    this.status = 'published';
    this.publishedAt = new Date();
    if (!this.slug) {
        this.slug = slugify(this.title);
    }
    this.readingTime = calculateReadingTime(this.content);
    return this.save();
};

BlogSchema.methods.updateWordCount = function () {
    const plainText = this.content
        .replace(/<[^>]*>/g, ' ')  // strip HTML tags
        .replace(/&[a-z]+;/gi, ' ')  // strip HTML entities like &amp;
        .replace(/\s+/g, ' ')  // normalize whitespace
        .trim();
    
    this.wordCount = plainText.length > 0 
        ? plainText.split(' ').filter(w => w.length > 0).length 
        : 0;
    return this;
};

BlogSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        this.updateWordCount();
    }
    next();
});

>>>>>>> main
export default mongoose.model('Blog', BlogSchema);
