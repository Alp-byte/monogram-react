const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const utils = require('../../utils');
module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'passwordHash',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    const SignUpform = { ...req.body };

    return User.findOne({ email }, (err, user) => {
      if (err) {
        return done({
          type: 'server',
          message: err,
          status: 500
        });
      }
      if (user) {
        return done(
          {
            type: 'form',
            message: 'Email is already in use.',
            fieldName: 'email',
            status: 401
          },
          false
        );
      }
      const newUser = new User({
        ...SignUpform,
        userId: utils.generateId(),
        emailConfirmationToken: utils.generateToken(),
        emailConfirmationExpires: Date.now() + 86400000, // 24 hours,
        emailSendDelayTimer: Date.now() + 300000
      });
      // newUser.verificationToken = genToken(60);
      return newUser.save(errs => {
        if (errs) {
          return done({
            type: 'server',
            message: errs,
            status: 500
          });
        }
        return done(null, newUser);
      });
    });
  }
);
