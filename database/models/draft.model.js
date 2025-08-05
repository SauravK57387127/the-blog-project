// ADMIN-side

import mongoose from 'mongoose';


const draftSchema = new mongoose.Schema({
  title:       { type: String },
//   slug:         { type: String, required: true, unique: true },
  content:     { type: String },
  coverImage: {type: String},
  tags:        [String],
  autosaveAt:  { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

export default mongoose.model('Draft', draftSchema);
 

// now! I want to add one more extra logic related to drafts. I want, when I publish or schedule blog I want to run a check if any draft of it remains or not. If so! I want to delete it from draft and then publish the blog. 

// Actually! I'm thinking of not having the code of it yet and just a direction of how this thing should be done or how and when I'll do this?!

// answer in very short.