fs     = require 'fs'
qs     = require 'querystring'
path   = require 'path'
crypto = require 'crypto'
moment = require 'moment'
_      = require 'lodash'
_.mixin require('underscore.string').exports()
{Iconv} = require 'iconv'

logger = require './logger'

###
# boot
###
isDir = (filePath) -> fs.lstatSync(filePath).isDirectory()

isModule = (filePath) ->
  path.extname(filePath) in ['.coffee', '.js']

exports.dirModulesRecur = (dir) ->
  iter = (p) ->
    p = path.resolve p
    if isDir(p)
      _(fs.readdirSync(p))
        .sortBy((f) -> not _.startsWith f, 'index') # read index at first
        .map((f) -> iter path.resolve p, f)
    else
      if isModule p then p else []
  _(iter dir).flatten()


###
# auth
###

exports.generateSalt = ->
  set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'
  setLen = set.length
  salt = ''
  for i in [0..8]
    salt += set[ Math.floor (Math.random() * setLen) ]
  salt

exports.hash = (passwd, salt) ->
  crypto.createHash('sha256').update(passwd + salt).digest 'hex'

# generate auth object for user creation
exports.generateAuth = (passwd) ->
  salt = exports.generateSalt()
  auth =
    salt     : salt
    password : exports.hash passwd, salt

exports.getUnixTimestamp = (dateObj = new Date) ->
  Math.round (dateObj.getTime() / 1000)


exports.parseDatetime = (str) ->
  str = str.replace('오전', 'AM').replace('오후', 'PM') + " +0900"
  new Date moment(str, ['YYYY-MM-DD A h:mm:ss Z', 'YYYY/MM/DD H:mm:ss Z', 'YYYY-MM-DD HH:mm Z']).valueOf()


exports.getDocIdFromUrl = (url) ->
  urls  = url.toLowerCase().split('?')
  query = (qs.parse urls[1]) || {}
  query.docid


exports.randomString = ->
  length  = 20
  chars   = 'abcdefghijklmnopqrstuvwxyz'
  charlen = chars.length
  ret     = ''

  for i in [0...length]
    randPos = Math.floor(Math.random() * charlen)
    ret += chars[randPos]
  ret



toUTF8 = new Iconv 'euckr', 'utf8'

toHex = (n) ->
  parseInt '0x' + n

decodeUnicodeUrl = (str = '') ->
  str.replace /%u[^%]{4}/g, (char) ->
    unescape String.fromCharCode parseInt char[2..], 16

decodeEuckrUrlToUTF8 = (str = '') ->
  str.replace /(%([^%]{2}))+/g, (chars) ->
    b = new Buffer chars.split('%')[1..].map toHex
    toUTF8.convert(b).toString()

decodeUrl = exports.decodeUrl = (str = '') ->
  try
    decodeEuckrUrlToUTF8 decodeUnicodeUrl str
  catch error
    logger.error '[utils.decodeUrl]', {error, str}
    ''

exports.getFilenameFromUrl = (url) ->
  urlComps = url.split '?'
  queryStr = decodeUrl urlComps[1]
  q = qs.parse queryStr.toLowerCase()
  q.filename || q.file ||
    _.last(q.mnf?.replace('_', '*').split(/\*|\?/)) ||
    path.basename urlComps[0]
