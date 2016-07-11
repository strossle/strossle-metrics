const bunyan = require('bunyan');

const LOGLEVEL = bunyan.resolveLevel(process.env.LOGLEVEL || 'WARN');

const log = bunyan.createLogger({
    name: 'strossle-metrics',
    level: LOGLEVEL,
});

module.exports = log;
