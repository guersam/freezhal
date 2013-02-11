expect  = require('chai').expect
logger  = require '../../lib/logger'
_       = require 'lodash'
async   = require 'async'
helper  = require '../helper'
utils   = require '../../lib/utils'


describe 'utils', ->

  describe 'decodeUrl', ->

    it 'decodes url properly', ->

      url = 'http://editor.freechal.com/GetFile.asp?mnf=509950%3FGCOM02%3F87%3F133014061%3F%uC7A5%uBCF4%uAE302.JPG'

      res = utils.decodeUrl url
      expect(res).to.match /\.jpg$/i

    it 'decodes more malcious url', ->
      url = 'http://editor.freechal.com/GetFile.asp?mnf=509950%3FGCOM02%3F32%3F133521384%3F%uC2DC%uAC01%uD300%uC790%uB8CC.JPG'

      res = utils.decodeUrl url
      expect(res).to.not.match /\u0000/
      expect(res).to.match /\.jpg$/i
