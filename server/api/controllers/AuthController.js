const passport = require('passport');
const requestIp = require('request-ip');
const facebookSuccessPopup = require('../passport/template/successPopups')
  .facebookSuccess;
const AuthController = {};
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const generateToken = require('../../utils').generateToken;
const sendEmail = require('../../utils').sendEmail;
const Font = require('../../models/Font');
const Frame = require('../../models/Frame');

AuthController.fetchProfile = async (req, res) => {
  const userIP = requestIp.getClientIp(req);

  const frames = await Frame.find().sort({ useQuantity: -1 });
  const fonts = await Font.find().sort({ useQuantity: -1 });
  res.json({
    user: req.user,
    user_ip: userIP,
    font_list: fonts,
    frame_list: frames
  });
};

AuthController.signup = (req, res, next) => {
  const SignUpform = { ...req.body };

  // !SOME VALIDATION
  return passport.authenticate('local.signup', (error, user) => {
    if (error) {
      return res.status(error.status).json({
        error
      });
    }
    /** send confirmation email */
    sendEmail({
      to: user.email,
      from: '<demo.app0121@gmail.com>',
      subject: `[MONOGRAM-MAKER] Email Confirmation!`,
      template: 'email-confirmation',
      templateVars: {
        title: `Email Confirmation!`,
        name: user.name,
        confirmUrl: `${req.protocol}://${req.hostname}${
          process.env.NODE_ENV === 'development' ? ':3000' : ''
        }/monogram/api/auth/confirm-email?token=${user.emailConfirmationToken}`
      }
    });
    /** generate a signed json web token and return it in the response */
    const token = jwt.sign(
      JSON.stringify({
        email: user.toJSON().email,
        expires: Date.now() + 14 * 24 * 60 * 60 * 1000
      }),
      process.env.JWT_SECRET
    );
    /** assign our jwt to the cookie */
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: Date.now() + 14 * 24 * 60 * 60 * 1000
    });
    return res.json({
      user: user.toObject()
    });
  })(req, res, next);
};

AuthController.signin = (req, res, next) => {
  const SignInform = { ...req.body };

  return passport.authenticate('local.signin', (error, user) => {
    if (error) {
      return res.status(401).json({
        error
      });
    }
    /** generate a signed json web token and return it in the response */
    const token = jwt.sign(
      JSON.stringify({
        email: user.toJSON().email,
        expires: Date.now() + 14 * 24 * 60 * 60 * 1000
      }),
      process.env.JWT_SECRET
    );
    /** assign our jwt to the cookie */
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: Date.now() + 14 * 24 * 60 * 60 * 1000
    });

    return res.json({
      user: user.toObject()
    });
  })(req, res, next);
};

AuthController.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development'
  });

  res.json({
    user: null
  });
};

// FACEBOOk
AuthController.fbAuthCallback = (req, res, next) => {
  passport.authenticate(
    'facebook',
    {
      scope: ['email'],
      session: false
    },
    (err, user, info) => {
      if (!err) {
        const payload = {
          email: user.email,
          expires: Date.now() + 12096e5 // 14 Days
        };

        /** assigns payload to req.user */
        req.login(payload, { session: false }, error => {
          if (error) {
            res.status(400).send({ error });
          }

          /** generate a signed json web token and return it in the response */
          const token = jwt.sign(
            JSON.stringify(payload),
            process.env.JWT_SECRET
          );

          /** assign our jwt to the cookie */
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: Date.now() + 14 * 24 * 60 * 60 * 1000
          });
          res.send(facebookSuccessPopup(JSON.stringify(user)));
        });
      }
      res.end();
    }
  )(req, res, next);
};

AuthController.confirmationEmailResend = (req, res) => {
  if (
    req.user &&
    new Date(req.user.emailSendDelayTimer).getTime() < new Date().getTime()
  ) {
    /** send confirmation email */

    User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { emailSendDelayTimer: Date.now() + 300000 } },
      err => {
        sendEmail({
          to: req.user.email,
          from: '<demo.app0121@gmail.com>',
          subject: `[MONOGRAM-MAKER] Email Confirmation!`,
          template: 'email-confirmation',
          templateVars: {
            title: `Email Confirmation!`,
            name: req.user.name,
            confirmUrl: `${req.protocol}://${req.hostname}${
              process.env.NODE_ENV === 'development' ? ':3000' : ''
            }/monogram/api/auth/confirm-email?token=${
              req.user.emailConfirmationToken
            }`
          }
        });
        return res.status(200).json({
          success: true
        });
      }
    );
  } else {
    const millis =
      new Date(req.user.emailSendDelayTimer).getTime() - new Date().getTime();
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);

    return res.status(403).json({
      message: `You Need to Wait ${minutes +
        ':' +
        (seconds < 10 ? '0' : '') +
        seconds}m. to send link again`
    });
  }
};
AuthController.confirmEmail = (req, res) => {
  return User.findOne(
    {
      emailConfirmationToken: req.query.token,
      emailConfirmationExpires: { $gt: Date.now() }
    },
    (err, user) => {
      if (!user) {
        return res.status(403).json({
          type: 'form',
          message: 'Invalid token',
          fieldName: 'password'
        });
      }
      const reUser = user;
      reUser.emailConfirmed = true;
      reUser.emailConfirmationToken = undefined;
      reUser.emailConfirmationExpires = undefined;
      return reUser.save(errs => {
        if (errs) {
          res.send(errs);
        }
        res.redirect('/');
      });
    }
  );
};

AuthController.sendresetPassword = (req, res) => {
  if (req.body.email) {
    return User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.status(403).json({
          error: {
            type: 'error',
            message: 'Email not found.'
          }
        });
      }
      const reUser = user;
      reUser.resetPasswordToken = generateToken();
      reUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      return reUser.save(errs => {
        if (errs) {
          res.status(403).json({
            error: {
              type: 'error',
              message: errs
            }
          });
        }
        sendEmail({
          to: user.email,
          from: '<demo.app0121@gmail.com>',
          subject: `[MONOGRAM-MAKER] Password Restore!`,
          template: 'reset-password',
          templateVars: {
            title: `Password Restore!`,
            name: user.name,
            emailAddress: user.email,
            resetUrl: `${req.protocol}://${req.hostname}${
              process.env.NODE_ENV === 'development' ? ':3000' : ''
            }/reset-password?token=${user.resetPasswordToken}`
          }
        });
        res.status(200).json({
          type: 'success',
          message: {
            text: 'Email with restore link was sent. Please check you email'
          }
        });
      });
    });
  } else {
    return res.status(403).json({
      error: {
        type: 'error',
        message: 'Email not found.'
      }
    });
  }
};

AuthController.resetPassword = (req, res) => {
  return User.findOne(
    {
      resetPasswordToken: req.query.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    (err, user) => {
      if (!user) {
        return res.status(403).json({
          error: {
            type: 'form',
            message: 'Invalid token',
            fieldName: 'password'
          }
        });
      }
      const reUser = user;

      if (user.validPassword(req.body.password)) {
        return res.status(403).json({
          error: {
            type: 'form',
            message: "You Can't Set Old Password As New One",
            fieldName: 'password'
          }
        });
      }
      reUser.passwordHash = req.body.password;

      reUser.resetPasswordToken = undefined;
      reUser.resetPasswordExpires = undefined;
      return reUser.save(errs => {
        if (errs) {
          return res.status(403).json({
            error: {
              type: 'form',
              message: errs,
              fieldName: 'password'
            }
          });
        }

        const token = jwt.sign(
          JSON.stringify({
            email: user.toJSON().email,
            expires: Date.now() + 14 * 24 * 60 * 60 * 1000
          }),
          process.env.JWT_SECRET
        );
        /** assign our jwt to the cookie */
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: Date.now() + 14 * 24 * 60 * 60 * 1000
        });
        return res.json({
          user: user.toObject()
        });
      });
    }
  );
};

module.exports = AuthController;
