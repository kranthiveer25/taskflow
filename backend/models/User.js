const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'teamleader', 'member'],
    default: 'member'
  }
}, { timestamps: true });

// Indexes for performance optimization
userSchema.index({ email: 1 });        // fast login lookup
userSchema.index({ role: 1 });         // filter by role (admin/teamleader/member)
userSchema.index({ name: 1 });         // search by name
userSchema.index({ createdAt: -1 });   // sort by newest

module.exports = mongoose.model('User', userSchema);