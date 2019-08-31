const mongoose = require('mongoose');

const dbConnnector = mongo => {
  mongoose.connect(mongo, {
    useNewUrlParser: true,
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 60000
  });
  process.env.SERVER_ENV === 'development' && mongoose.set('debug', true);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + mongo);
  });
  mongoose.connection.on('error', err => {
    console.log(`Connection error: ${err}`);
    mongoose.disconnect();
  });
  mongoose.connection.on('reconnected', () => {
    console.log('Database reconnected');
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
  });
};

module.exports = dbConnnector;
