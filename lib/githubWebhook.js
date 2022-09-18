const crypto = require('crypto');
const fs = require('fs');
const checkErrors = require('../utils/checkErrors');
const AuthorizationError = require('../utils/errors/AuthorizationError');
const shell = require('../utils/shell');

const validRepositories = () =>
  fs
    .readdirSync('../')
    .filter((dirr) => dirr !== 'main-worker' && fs.lstatSync(`../${dirr}`).isDirectory());

const githubWebhookListen = async (req, res, next) => {
  try {
    const { HOOK_SECRET = 'secret' } = process.env;
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', HOOK_SECRET);
    const digest = `sha256=${hmac.update(req.rawBody).digest('hex')}`;
    if (signature !== digest) {
      throw new AuthorizationError('Unauthorized!');
    }
    const pushEvent = req.body;
    if (pushEvent.ref === 'refs/heads/main') {
      // pipline for update
      const { name } = pushEvent.repository || {};
      const repositories = validRepositories();
      if (repositories.includes(name)) {
        await shell(`git -C ../${name} pull`);
        await shell(`pm2 reload ${name}`);
        return res.status(202).send('Success');
      }
    }
    if (pushEvent.zen) {
      return res.status(202).send('Pong');
    }
    return res.status(202).send('Not Main; Abort;');
  } catch (error) {
    return checkErrors(error, next);
  }
};

module.exports = {
  githubWebhookListen,
};
