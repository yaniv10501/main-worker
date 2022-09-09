const execa = require('execa');

const shell = (cmd) => execa(cmd, { stdio: ['pipe', 'pipe', 'inherit'], shell: true });

module.exports = shell;
