// USER - side

import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name:         { type: String },
  avatar:       { type: String },
  bio:          { type: String },
  social: {                       
    github:   String,
    twitter:  String,
    linkedin: String,
  },
  role:            { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:       { type: Date, default: Date.now },
});


export default mongoose.model('User', userSchema);
