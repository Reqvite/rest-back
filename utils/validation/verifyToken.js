const jwt = require('jsonwebtoken');

// const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header('Authorization');

//     if (!token) {
//       return res.status(403).send('Access denied');
//     }

//     if (token.startsWith('Bearer ')) {
//       token = token.slice(7, token.length).trimLeft();
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = verified;

//     return next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(403).send('Access denied');
    }

    let verified;
    try {
      // First, try to verify as an access token
      verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = verified;
      return next();
    } catch (err) {
      // If verification as an access token fails, try to verify as a refresh token
      try {
        verified = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        req.user = verified;
        return next();
      } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = verifyToken;
