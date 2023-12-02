const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  // Add any additional fields as per your requirement
});

const List = mongoose.model('List', listSchema);

module.exports = List;
