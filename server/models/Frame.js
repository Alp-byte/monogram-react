const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FrameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  useQuantity: {
    type: Number,
    default: 1
  },
  search: {
    type: [String],
    default: []
  },
  hasViewBox: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Frame', FrameSchema);
