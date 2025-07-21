// ADMIN-side

import mongoose from 'mongoose';


const blogSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  slug:         { type: String, required: true, unique: true },
  content:      { type: String, required: true },
  excerpt:      { type: String },
  coverImage:   { type: String },
  tags:         [String],
  category:     { type: String },
  status:       { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  authorId:     { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  readingTime:  { type: Number },
  scheduleAt:   { type: Date },
  publishedAt:  { type: Date },
  createdAt:    { type: Date, default: Date.now },
});

blogSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model('Blog', blogSchema);
