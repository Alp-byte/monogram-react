const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Email', EmailSchema);
