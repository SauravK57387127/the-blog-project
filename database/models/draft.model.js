// ADMIN-side

import mongoose from 'mongoose';


const draftSchema = new mongoose.Schema({
  title:       { type: String },
  content:     { type: String },
  tags:        [String],
  authorId:    { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  autosaveAt:  { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

export default mongoose.model('Draft', draftSchema);
