const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Vote = new Schema({
  ip: { type: String, required: true }
});
const MonogramSchema = new Schema({
  // USED IN WHEN IMPORT TO APPLICATION
  builderData: {
    type: Schema.Types.Mixed,
    required: true
  },
  //nanoid generated unique

  monogramId: {
    type: String,
    required: true
  },

  // Creator Populate Ref
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  // Changed only on first db write
  creationDate: {
    type: Date,
    default: Date.now
  },
  // Changed on every db write
  updateDate: {
    type: Date,
    default: Date.now
  },

  // Binary jpeg/png preview image
  previewImage: {
    type: Buffer,
    required: true
  },

  // Title User Entered in Save Form
  title: {
    type: String,
    required: true
  },
  // Slug based on Title (e.g american-frame)
  slug: {
    type: String,
    required: true
  },

  // Description User Entered in Save Form
  description: {
    type: String
  },

  // Rating of Frame
  upvotes: { type: [Vote], default: [] },
  // Views COunt
  views: {
    type: Number,
    default: 1
  },

  isTopRated: {
    type: Boolean,
    default: false
  },

  // ENUM : private, public
  privacy: { type: String, required: true },
  // Tags Populate Ref
  tags: [{ type: Schema.ObjectId, ref: 'Tag' }]
});

module.exports = mongoose.model('Monogram', MonogramSchema);
