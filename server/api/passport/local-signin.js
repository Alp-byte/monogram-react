const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'passwordHash',
    passReqToCallback: true
  },
  (req, email, password, done) =>
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(
          {
            type: 'server',
            message: err,
            status: 500
          },
          false
        );
      }

      if (!user) {
        return done(
          {
            type: 'form',
            message: 'Email not found',
            fieldName: 'email',
            status: 401
          },
          false
        );
      }
      if (!user.passwordHash && user.socialPlatform) {
        return done(
          {
            type: 'form',
            message: `This account doesn't have password set. Please use ${
              user.socialPlatform
            } to log in`,
            fieldName: 'password',
            status: 401
          },
          false
        );
      }
      if (!user.validPassword(password)) {
        return done(
          {
            type: 'form',
            message: 'Wrong Password',
            fieldName: 'password',
            status: 401
          },
          false
        );
      }
      return done(null, user);
    })
);
