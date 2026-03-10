// database/models/author.model.js

import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  profileImage: { type: String },
  email: { type: String },
  socialLinks: {
    twitter: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Author', AuthorSchema);