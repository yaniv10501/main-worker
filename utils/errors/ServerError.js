const { captureSentryException } = require('../sentry');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  captureSentryException(err);
  res.status(err.status || 500);
  res.json({ message: err.message || 'An error has occurred on the server' });
};
