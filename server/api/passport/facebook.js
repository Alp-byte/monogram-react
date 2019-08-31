const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models/User');
const utils = require('../../utils');
module.exports = new FacebookStrategy(
  {
    clientID: '509498729798870',
    clientSecret: 'c6e5a53c149f24869ac6fa5e43226dbc',
    callbackURL:
      'https://monogrammaker.com/monogram/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'] //This
  },
  async function(accessToken, refreshToken, profile, done) {
    const userEmail = profile.emails[0] ? profile.emails[0].value : null;
    if (userEmail) {
      try {
        let user = await User.findOne({ email: userEmail });

        if (!user) {
          const newUser = await new User({
            email: userEmail,
            userId: utils.generateId(),
            socialPlatform: 'facebook',
            emailConfirmed: true,
            name: `${profile.name.givenName} ${profile.name.middleName ||
              ''} ${profile.name.familyName || ''}`
          });
          await newUser.save();
          user = newUser;
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  }
);
