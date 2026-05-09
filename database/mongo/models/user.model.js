import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        // ===== CLERK INTEGRATION =====
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // ===== BASIC INFO =====
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Changed from "avatar" to "profileImage" (matches our services)
        profileImage: {
            type: String,
            default: null,
        },

        // ===== STATUS =====
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        // ===== METADATA =====
        lastLoginAt: Date,

        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Auto-manages createdAt/updatedAt
    },
);

export default mongoose.model('User', UserSchema);
