expect = require('chai').expect
logger = require '../../lib/logger'
_      = require 'lodash'
async  = require 'async'
helper = require '../helper'
{getDomFromFixture, BASEURL} = helper

{Site} = require '../../lib/entity'


describe 'Site', ->

  describe 'getChildren', ->

    it 'should work with jquery', (done) ->
      s = new Site url: 'http://home.freechal.com/ssowhat'
      getDomFromFixture 'home', (err, $) ->
        s.genMenu $
        s.getChildren $, (err, children) ->
          expect(children).to.have.length 42
          expect(children[0].data.grp).to.equal 'So What 백서'
          expect(children[11].data.grp).to.be.null
          done()
