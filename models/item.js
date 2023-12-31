const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  archived: {
    type: Boolean,
    default: false
}
  // Add any additional fields as per your requirement
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
