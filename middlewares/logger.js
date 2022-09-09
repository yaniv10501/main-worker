const winston = require('winston');
const path = require('path');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/request.log'),
      maxFiles: 1,
      maxsize: 1000 * 1000 * 10,
    }),
  ],
  format: winston.format.json(),
  msg: '{{req.ip}} {{req.method}} {{req.url}}',
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      maxFiles: 1,
      maxsize: 1000 * 1000 * 10,
    }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
