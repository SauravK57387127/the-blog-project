import mongoose from 'mongoose';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

const BlogSchema = new mongoose.Schema({
  // ========== CONTENT ==========
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  
  slug: {
    type: String,
    unique: true,
    sparse: true,  // Only required for published blogs
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
  
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  
 category: {
  type: String,
  enum: ['tech', 'life', 'Web Development', 'experiments', 'Technology', 'Tutorial', 'DevOps', 'webdev', 'Best Practices'],
  default: 'tech',
  index: true,
}, 
  
readingTime: {
  type: Number,  // minutes
  default: 5,
},

  // ========== AUTHOR ==========
  authorId: {
    type: String,
    required: true,
    default: 'single-author',
  },
  
  // ========== STATUS ==========
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published'],
    default: 'draft',
    index: true,
  },
  
  publishedAt: Date,
  scheduledAt: Date,
  autosaveAt: Date,  // For drafts

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
});


// Text search index for fast searching
BlogSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
}, {
  weights: {
    title: 10,      // Title matches are most important
    excerpt: 5,     // Excerpt matches are medium importance
    content: 1,     // Content matches are least important
  },
  name: 'blog_text_search',
});

// Compound indexes for filtering
BlogSchema.index({ status: 1, category: 1, publishedAt: -1 });
BlogSchema.index({ status: 1, tags: 1, publishedAt: -1 });

// Indexes
BlogSchema.index({ status: 1, publishedAt: -1 });

// Virtuals
BlogSchema.virtual('isDraft').get(function() {
  return this.status === 'draft';
});

BlogSchema.virtual('isPublished').get(function() {
  return this.status === 'published';
});

// ========== METHODS ========== ← ADD HERE
BlogSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  if (!this.slug) {
    this.slug = slugify(this.title);
  }
  this.readingTime = calculateReadingTime(this.content);
  return this.save();
};

BlogSchema.methods.updateWordCount = function() {
  const words = this.content.trim().split(/\s+/).length;
  this.wordCount = words;
  return this;
};

BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.updateWordCount();
  }
  next();
});

export default mongoose.model('Blog', BlogSchema);
