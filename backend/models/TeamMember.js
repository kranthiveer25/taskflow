const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Indexes for performance optimization
teamMemberSchema.index({ team: 1 });              // fetch all members of a team
teamMemberSchema.index({ user: 1 });              // fetch all teams for a user
teamMemberSchema.index({ team: 1, user: 1 }, { unique: true }); // prevent duplicate members

module.exports = mongoose.model('TeamMember', teamMemberSchema);