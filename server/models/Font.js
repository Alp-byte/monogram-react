const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FontSchema = new Schema({
  font_family: {
    type: String,
    required: true
  },
  font_id: {
    type: Number,
    required: true
  },
  useQuantity: {
    type: Number,
    default: 1
  },
  search: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Font', FontSchema);
