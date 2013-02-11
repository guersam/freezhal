expect     = require('chai').expect
logger     = require '../../lib/logger'
_          = require 'lodash'
async      = require 'async'
helper     = require '../helper'
{download} = require '../../lib/connect'


describe 'download', ->
  @timeout 5000

  it 'returns error with non-existing url', (done) ->
    download 'http://www.ssowhat.com/image/ticket-4th.JPG', 'tmp', '1', (err, filePath) ->
      expect(err.code).to.equal 'ENOTFOUND'
      expect(filePath).to.not.exist
      done()

  it 'returns error with timeouted url', (done) ->
    @timeout 10000
    download 'http://tfile.nate.com/download.asp?FileID=16764321', 'tmp', '2', (err, filePath) ->
      expect(err.code).to.equal 'ECONNRESET'
      expect(filePath).to.not.exist
      done()

  it 'handles malcious url', (done) ->
    download 'http://editor.freechal.com/GetFile.asp?mnf=509950%3FGCOM02%3F32%3F133521384%3F%uC2DC%uAC01%uD300%uC790%uB8CC.JPG', 'tmp', '3', (err, filePath) ->
      expect(err).to.not.exist
      expect(filePath).to.match /.+\.jpg$/i
      done()
