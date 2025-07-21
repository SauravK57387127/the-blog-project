// USER - side

import mongoose from 'mongoose';


const likeSchema = new mongoose.Schema({
  userId:    { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  blogId:    { type: mongoose.Types.ObjectId, ref: 'Blog' },
  commentId: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  likedAt:   { type: Date, default: Date.now },
});

likeSchema.index({ userId: 1, blogId: 1 }, { unique: true, partialFilterExpression: { blogId: { $exists: true } } });
likeSchema.index({ userId: 1, commentId: 1 }, { unique: true, partialFilterExpression: { commentId: { $exists: true } } });


export default mongoose.model('Like', likeSchema);
