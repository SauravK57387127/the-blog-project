import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  
  // Links to User if authenticated
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  
  unsubscribedAt: Date,
  
  // Metadata
  source: {
    type: String,
    enum: ['homepage', 'blog_page', 'newsletter_page', 'user_signup'],
    default: 'newsletter_page',
  },
  
  ipAddress: String,
  
}, {
  timestamps: true,
});

export default mongoose.model('Subscriber', SubscriberSchema);
