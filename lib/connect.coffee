fs   = require 'fs'
path = require 'path'

request = require 'request'
shell   = require 'shelljs'

_       = require 'lodash'
async   = require 'async'
{Iconv} = require 'iconv'
toUTF8 = new Iconv 'cp949', 'UTF8//TRANSLIT//IGNORE'

jsdom   = require 'jsdom'
jquery  = fs.readFileSync(__dirname + '/dom/jquery.min.js').toString()

logger = require './logger'
utils  = require './utils'

Freechal =
  genMenuScript : fs.readFileSync(__dirname + '/dom/ComMenuCommon.js').toString()


get = (url, callback) ->
  logger.verbose "[connect] GET #{url}"

  left = 3
  do trial = ->
    request {
      method   : 'GET'
      encoding : 'binary'
      url      : url
    }, (err, res, body) ->
      if err
        if --left == 0 or err.code not in ['ECONNRESET', 'ETIMEDOUT']
          logger.warn '[connect.get]', err
          console.error err
        else
          do trial
          return

      if _.isString body
        body = new Buffer body, 'binary'
      else
        logger.warn '[connect.get]', 'unknown body'
        console.error err

      res.text = toUTF8.convert(body)?.toString() || ''
      callback err, res


getDom = (urlOrHtml, callback) ->

  fixTagBrakingImoticon = (html) ->
    html.replace />( {0,1}[_.▽ㅁ] {0,1})</, '&gt;$1&lt;'

  options =
    html : null,
    src  : [Freechal.genMenuScript, jquery]
    done : (err, window) ->
      window.jQuery.window = window
      callback err, window?.jQuery

  if urlOrHtml[0...4] == 'http'
    get urlOrHtml, (err, res) ->
      if err then return callback err
      options.html = fixTagBrakingImoticon res.text
      jsdom.env options
  else
    options.html = fixTagBrakingImoticon urlOrHtml
    jsdom.env options


UPLOAD_ROOT = './uploads/'+ process.env.COMMUNITY
download = (url, prefix, articleId, callback) ->
  filename = utils.getFilenameFromUrl url

  dir = "#{UPLOAD_ROOT}/#{prefix}/#{articleId}"
  shell.mkdir '-p', dir
  filePath = path.join dir, filename

  # Dirty error handling
  errorOccured = false
  localFile = fs.createWriteStream filePath
  request url,
    headers:
      referer: 'http://freechal.com'
    timeout: 5000
  .on 'error', (err) ->
    errorOccured = err
    localFile.end()
  .pipe(localFile)
  .on 'close', ->
    if errorOccured
      callback errorOccured
    else
      callback null, filePath


post = (url, data, callback) ->
  logger.verbose "[connect] POST #{url}"
  request {
    method   : 'POST'
    url      : url
    form     : data
    encoding : 'binary'
  }, (err, res, body) ->
    body = new Buffer body, 'binary'
    res.text = toUTF8.convert body
    callback err, res



login = (opt, callback) ->
  logger.verbose "Logging in..."
  post 'https://ses.freechal.com/signin/verify.asp', {
    UserID: opt.id, Password: opt.pass, LOGINURL: opt.url
  }, (err, res) ->
    if err then return callback err

    if reurl = res.body.match(/URL=([^">]+)/)?[1]
      logger.info "Login invalid"
      callback null, false
    else
      logger.info "Logged in as #{opt.id}"
      callback err, true


module.exports = {get, getDom, download, post, login}
