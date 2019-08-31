const express = require('express');
const api = express.Router();
const passport = require('passport');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const authRequired = require('./middleware/authRequired');
const fetchUser = require('./middleware/fetchUser');

const EmailsController = require('./controllers/EmailsController');
const ConvertationController = require('./controllers/ConvertationController');
const GalleryController = require('./controllers/GalleryController');
const AuthController = require('./controllers/AuthController');

/* rest api */

// EMAILS API

api.post(
  '/emails/new',

  EmailsController.saveEmail
);

api.post(
  '/update-assests',

  ConvertationController.updateAssets
);

// GALLERY API

api.get(
  '/monograms/user-monograms',
  authRequired,
  GalleryController.getUserMonograms
);
api.get('/monograms/public-monograms', GalleryController.getPublicMonograms);

api.post('/monogram/new', authRequired, GalleryController.saveMonogram);
api.get('/monogram/:id', fetchUser, GalleryController.getMonogram);
api.delete('/monogram/:id', authRequired, GalleryController.deleteMonogram);
api.get(
  '/monogram/:id/upvote',

  GalleryController.performUpvoteOnMonogram
);

api.get(
  '/monogram/:id/change-status',
  fetchUser,
  GalleryController.changeMonogramStatus
);
api.get('/tags/top', GalleryController.getTopTags);
api.get('/monogram/:id/report', GalleryController.monogramReport);
api.post('/slack', GalleryController.slackResponse);
// AUTH API

api.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    display: 'popup',
    scope: ['email'],
    session: false
  })
);
api.get('/auth/facebook/callback', AuthController.fbAuthCallback);
api.get('/auth/fetch-profile', fetchUser, AuthController.fetchProfile);
api.post('/auth/signin', AuthController.signin);
api.post('/auth/signup', AuthController.signup);
api.get(
  '/auth/confirm-resend',
  fetchUser,
  AuthController.confirmationEmailResend
);
api.get('/auth/logout', AuthController.logout);
api.get('/auth/confirm-email', AuthController.confirmEmail);
api.post('/auth/forgot-password', AuthController.sendresetPassword);
api.post('/auth/reset-password', AuthController.resetPassword);

// CONVERATATION API
api.post('/svgToEps', upload.single('file'), ConvertationController.svgToEps);
api.post('/svgToDxf', upload.single('file'), ConvertationController.svgToDxf);

module.exports = api;
