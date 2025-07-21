// ADMIN-side

import mongoose from 'mongoose';


const blogMetadataSchema = new mongoose.Schema({
  siteTitle:    { type: String },
  siteDesc:     { type: String },
  favicon:      { type: String },
  ogDefaultImg: { type: String },
  updatedAt:    { type: Date, default: Date.now },
});

export default mongoose.model('BlogMetadata', blogMetadataSchema);
