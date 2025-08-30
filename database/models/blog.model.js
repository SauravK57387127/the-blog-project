// ADMIN-side

import mongoose from 'mongoose';


const blogSchema = new mongoose.Schema({
    slug:         { type: String, unique: true },
  title:        { type: String, required: true },
  content:      { type: String },
  coverImage:   { type: String },
  tags:         [String],
  scheduledAt:   { type: Date },
  publishedAt:  { type: Date },
  status:       { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  category:     { type: String },
  createdAt:    { type: Date, default: Date.now },
});

blogSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model('Blog', blogSchema);

