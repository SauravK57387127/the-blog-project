// USER - side
// models/Like.js
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: mongoose.Types.ObjectId, ref: 'Blog', required: true },
    likedAt: { type: Date, default: Date.now },
});

likeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
