fs = require 'fs'

{getDom} = require '../../lib/connect'
{Iconv} = require 'iconv'
toUTF8 = new Iconv 'cp949', 'utf-8'

exports.getDomFromFixture = (name, callback) ->
  html = fs.readFileSync(__dirname + "/../fixture/#{name}.html")
  html = toUTF8.convert(html).toString()
  getDom html, callback
  
exports.BASEURL =
  BBS : 'http://bbs.freechal.com/ComService/Activity'
  COM : 'http://community.freechal.com/ComService/Activity'
  IMG : 'http://album.freechal.com/ComService/Activity'
  PDS : 'http://vdown.freechal.com/ComService/Activity'
