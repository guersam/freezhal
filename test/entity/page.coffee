expect = require('chai').expect
logger = require '../../lib/logger'
_      = require 'lodash'
async  = require 'async'
helper = require '../helper'
{getDomFromFixture, BASEURL} = helper

{Page} = require '../../lib/entity'

describe 'Page', ->

  DOM = null
  keys    = ['bbs', 'abbs', 'pds', 'album']
  fNames  = keys.map (k) -> 'page_' + k
  async.map fNames, getDomFromFixture, (err, fxs) ->
    DOM = _.object keys, fxs

  describe 'getChildren', ->

    it 'works with a BBS', (done) ->
      p = new Page url: BASEURL.BBS+'/BBS/CsBBSList.asp?GrpId=509950&ObjSeq=1'
      p.getChildren DOM.bbs, (err, children) ->
        expect(children).to.have.length 15
        done()

    it 'also works with an Anonymous BBS', (done) ->
      p = new Page url: BASEURL.BBS+'ABBS/CsBBSList.asp?GrpId=509950&ObjSeq=2'
      p.getChildren DOM.abbs, (err, children) ->
        expect(children).to.have.length 30
        done()

    it 'works with a PDS of course', (done) ->
      p = new Page url: BASEURL.COM+'/BBS/CsBBSList.asp?GrpId=509950&ObjSeq=1'
      p.getChildren DOM.pds, (err, children) ->
        expect(children).to.have.length 30
        done()

    it 'even works with a Photo Album', (done) ->
      p = new Page url: BASEURL.COM+'Album/CsPhotoList.asp?GrpId=509950&ObjSeq=1&grpurl=ssowhat'
      p.getChildren DOM.album, (err, children) ->
        expect(children).to.have.length 40
        done()

