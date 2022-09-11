const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const { version } = require('../package.json');

const initSentry = () => {
  const { NODE_ENV, SENTRY_DSN } = process.env;
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.2,
    environment: NODE_ENV,
    release: `Main-Worker@${version}`,
  });
};
const captureSentryException = (error) => {
  Sentry.captureException(error);
};
module.exports = { initSentry, captureSentryException };
