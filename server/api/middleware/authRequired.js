const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const authRequired = (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (Date.now() > decode.expires) {
        return res.status(200).json({
          user: null
        });
      }
      if (err) {
        return res.status(403).json({
          error: {
            type: 'server',
            message: 'Invalid token'
          },
          isLoggedIn: false
        });
      } else {
        const FindUser = await User.findOne({ email: decode.email });
        if (FindUser) {
          req.user = FindUser;
          next();
        } else {
          res.cookie('jwt', null, {
            httpOnly: true,
            secure: !process.env.NODE_ENV === 'production'
          });
          return res.status(404).json({
            error: {
              type: 'server',
              message: 'User not exist anymore'
            }
          });
        }
      }
    });
  } else {
    res.json({
      user: null
    });
  }
};

module.exports = authRequired;
