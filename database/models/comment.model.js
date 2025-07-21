// USER - side

import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
  blogId:   { type: mongoose.Types.ObjectId, ref: 'Blog', required: true },
  userId:   { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Types.ObjectId, ref: 'Comment', default: null },
  content:  { type: String, required: true },
  createdAt:{ type: Date, default: Date.now },
  updatedAt: {type: Date, }
});

commentSchema.index({ blogId: 1, parentId: 1 });

export default mongoose.model('Comment', commentSchema);


