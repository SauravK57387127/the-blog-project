// ADMIN-side

import mongoose from 'mongoose';


const DraftSchema = new mongoose.Schema({
    title: { type: String, required: true },
content: { type: String, default: "" },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now },
    autosaveAt: { type: Date, default: Date.now }
});


export default mongoose.model('Draft', DraftSchema);
 

