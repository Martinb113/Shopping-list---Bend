const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  }
  // Add any additional validation or fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
