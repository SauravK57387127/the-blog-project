import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    email: { type: String },

    // Personal tagline / quote shown on about page
    tagline: { type: String },

    socialLinks: {
        twitter: { type: String },
        linkedin: { type: String },
        github: { type: String },
        website: { type: String },
        leetcode: { type: String },
    },

    // About page dynamic sections
    learningAreas: [
        {
            label: { type: String },
            detail: { type: String },
        },
    ],

    currentFocus: [
        {
            label: { type: String },
            detail: { type: String },
        },
    ],

    writingTopics: [
        {
            label: { type: String },
            detail: { type: String },
        },
    ],

    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Author', AuthorSchema);
