const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressStaticGzip = require('express-static-gzip');
const dbConnector = require('./db_connector');
const passport = require('passport');
const facebookStrategy = require('./api/passport/facebook');
const localSignin = require('./api/passport/local-signin');
const localSignup = require('./api/passport/local-signup');
const Monogram = require('./models/Monogram');

const api = require('./api');

const app = express();
require('dotenv').config();
dbConnector(
  process.env.SERVER_ENV === 'development' ||
    process.env.NODE_ENV === 'development'
    ? process.env.DB_CONNECT_DEV
    : process.env.DB_CONNECT_PROD
);
// app.use(passport.initialize());
passport.use(facebookStrategy);
passport.use('local.signin', localSignin);
passport.use('local.signup', localSignup);

app.use(logger('dev'));
app.set('view engine', 'ejs');
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
);
app.use(cookieParser());

app.use('/monogram/api', api);

if (process.env.NODE_ENV === 'development') {
  console.log('Creating development build...');
  process.env.BABEL_ENV = 'development';
  const webpack = require('webpack');
  const paths = require('../config/paths');
  const webpackConfig = require('../config/webpack.config')('development');
  const compiler = webpack(webpackConfig);
  app.use(express.static(paths.devBuild));
  app.use(
    require('webpack-dev-middleware')(compiler, {
      writeToDisk: true,
      publicPath: webpackConfig.output.publicPath
    })
  );
  app.use(require('webpack-hot-middleware')(compiler));
}
app.get('/robots.txt', function(req, res) {
  res.type('text/plain');
  res.send('');
});

if (process.env.NODE_ENV !== 'development') {
  app.use(
    expressStaticGzip(path.join(__dirname, 'build'), {
      index: true,
      orderPreference: ['br'],
      enableBrotli: true
    })
  );
}
app.get('/g/:id/:slug', async (req, res) => {
  if (req.params.id) {
    const monogram = await Monogram.findOne({
      monogramId: req.params.id
    }).exec();
    if (monogram && monogram.privacy !== 'private') {
      const base64data = await Buffer.from(
        monogram.previewImage,
        'binary'
      ).toString('base64');
      res.render(
        path.join(
          __dirname,
          process.env.NODE_ENV === 'development'
            ? '../devbuild/index.ejs'
            : 'build/index.ejs'
        ),
        { previewCard: 'data:image/png;base64,' + base64data, monogram }
      );
    } else {
      res.render(
        path.join(
          __dirname,
          process.env.NODE_ENV === 'development'
            ? '../devbuild/index.ejs'
            : 'build/index.ejs'
        )
      );
    }
  } else {
    res.render(
      path.join(
        __dirname,
        process.env.NODE_ENV === 'development'
          ? '../devbuild/index.ejs'
          : 'build/index.ejs'
      )
    );
  }
});

app.use('*', (req, res) => {
  res.render(
    path.join(
      __dirname,
      process.env.NODE_ENV === 'development'
        ? '../devbuild/index.ejs'
        : 'build/index.ejs'
    )
  );
});

module.exports = app;
