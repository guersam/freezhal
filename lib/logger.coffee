winston = require 'winston'

options =
  colorize : true
  level    : 'info'

if process.env.NODE_ENV == 'test'
  options.level = 'debug'

module.exports = new winston.Logger {
  transports: [
    new (winston.transports.Console)(options)
    new (winston.transports.File) filename: "#{process.env.COMMUNITY || 'default'}.log"
  ]
}
