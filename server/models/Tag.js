const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  originalCreator: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  useQuantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Tag', TagSchema);
