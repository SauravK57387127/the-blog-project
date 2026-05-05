// USER - side

// models/Bookmark.js
import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: mongoose.Types.ObjectId, ref: 'Blog', required: true },
    savedAt: { type: Date, default: Date.now },
});

bookmarkSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
