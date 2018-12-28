const path = require('path');
const winston = require('winston');
const mkdirp = require('mkdirp');
const config = require('./config');

mkdirp.sync(config.get('logDir'));
const logPath = path.join(config.get('logDir'), `./log-${Date.now()}.txt`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: logPath,
      level: config.get('fileLogLevel')
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: config.get('logLevel')
    })
  ]
});

module.exports = logger;
