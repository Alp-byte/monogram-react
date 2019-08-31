const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const fetchUser = (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (Date.now() > decode.expires) {
        next();
      }
      if (err) {
        next();
      } else {
        const FindUser = await User.findOne({ email: decode.email });
        if (FindUser) {
          req.user = FindUser;
          next();
        } else {
          next();
        }
      }
    });
  } else {
    next();
  }
};

module.exports = fetchUser;
