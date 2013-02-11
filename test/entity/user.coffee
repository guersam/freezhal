expect = require('chai').expect
logger = require '../../lib/logger'
_      = require 'lodash'
async  = require 'async'
helper = require '../helper'
{getDomFromFixture, BASEURL} = helper

{AnonymousUser, User} = require '../../lib/entity'


describe 'AnynomousUser', ->

  describe 'save', ->

    it 'returns data', (done) ->
      data =
        anonymous_email: 'abc@freechal.com'
        anonymous_name: '망함'

      u = new AnonymousUser data
      u.save (err, user) ->
        expect(err).to.not.exist
        expect(user.data).to.deep.equal data
        done()

