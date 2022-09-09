require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errorLogger } = require('express-winston');
const logger = require('./utils/logger');
const ServerError = require('./utils/errors/ServerError');
const ResourceNotFound = require('./utils/errors/ResourceNotFound');
const corsOptions = require('./utils/cors');
const { requestLogger } = require('./middlewares/logger');
const { githubWebhookListen } = require('./lib/githubWebhook');
const { initSentry } = require('./utils/sentry');

initSentry();

const app = express();

const { WORKER_PORT = 3010, NODE_ENV = 'development' } = process.env;

app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
      }
    },
  })
);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

app.use(requestLogger);

app.post('/hook', githubWebhookListen);

app.use(errorLogger);

app.use((req, res, next) => new ResourceNotFound(req, res, next));

app.use(ServerError);

app.listen(WORKER_PORT, () => {
  logger.log(`Listening on Port - ${WORKER_PORT}, Environment - ${NODE_ENV}`);
});
