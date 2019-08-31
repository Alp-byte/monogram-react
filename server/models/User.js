const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  emailConfirmationToken: String,
  emailConfirmationExpires: Date,
  emailSendDelayTimer: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  regDate: { type: Date, default: Date.now },
  socialPlatform: {
    type: String
  },
  passwordHash: {
    type: String
  }
});
UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('passwordHash')) return next();
  const hash = bcrypt.hashSync(user.passwordHash, bcrypt.genSaltSync(5), null);
  user.passwordHash = hash;
  next();
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};
module.exports = mongoose.model('User', UserSchema);
