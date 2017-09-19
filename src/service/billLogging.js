const winston = require('winston');

function billLogging(client) {
  winston.debug("debug-test")
  winston.configure({
    transports: [
      new(winston.transports.Console)({
        level: client.config.loggerLevel
      }),
      new(winston.transports.File)({
        name: 'fileBillLog',
        filename: '../logs/bill.log',
        level: 'info'
      }),
      new(winston.transports.File)({
        name: 'fileBillDebugLog',
        filename: '../logs/billDebug.log',
        level: 'debug'
      })
    ]
  })

  winston.debug("Initialized logging service")
  return winston
}

module.exports = billLogging
