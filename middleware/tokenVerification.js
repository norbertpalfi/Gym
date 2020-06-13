const jwt = require('jsonwebtoken');

module.exports = {
  auth(req, res, next) {
    const token = req.cookies.auth;
    if (!token) {
      next();
    } else {
      try {
        const verified = jwt.verify(token, '@WorldOfDiver');
        req.data = verified;
        next();
      } catch (err) {
        res.status(400).send('Invalid token');
      }
    }
  },
};
