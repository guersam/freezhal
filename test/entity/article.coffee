expect = require('chai').expect
logger = require '../../lib/logger'
{getDom} = require '../../lib/connect'
_      = require 'lodash'
async  = require 'async'
helper = require '../helper'
moment = require 'moment'
{getDomFromFixture, BASEURL} = helper

{Article, AnonymousUser, Comment, User} = require '../../lib/entity'

describe 'Article', ->

  DOM = null
  keys    = ['bbs', 'bbs_photo', 'abbs', 'reply', 'pds', 'album', 'album2']
  fNames  = keys.map (k) -> 'article_' + k
  async.map fNames, getDomFromFixture, (err, fxs) ->
    DOM = _.object keys, fxs

  ArticleData =
    bbs :
      url: BASEURL.BBS+'/BBS/CsBBSContent.asp?GrpId=509950&ObjSeq=1&PageNo=1&DocId=133787697'
      type: 'BBS'

    bbsPhoto :
      url: BASEURL.BBS+'/BBS/CsBBSContent.asp?GrpId=509950&ObjSeq=1&PageNo=6&DocId=133773833'
      type: 'BBS'

    reply :
      url: BASEURL.BBS+'/BBS/CsBBSContent.asp?GrpId=509950&ObjSeq=2&PageNo=8&DocId=133292911'
      type: 'BBS'

    abbs:
      url: BASEURL.BBS+'/ABBS/CsBBSContent.asp?GrpId=509950&ObjSeq=2&PageNo=2&DocId=9623457'
      type: 'ABBS'

    pds:
      url: BASEURL.COM+'/PDS/CsPDSContent.asp?GrpId=509950&ObjSeq=3&PageNo=1&DocId=31399311'
      type: 'PDS'

    album:
      url: BASEURL.COM+'/Album/CsPhotoView.asp?GrpId=509950'
      type: 'Album'

    album2:
      url: BASEURL.COM+'/Album/CsPhotoView.asp?GrpId=891025&ObjSeq=1&SeqNo=1023&PageNo=106'
      type: 'Album'


  describe 'parseUser', ->

    it 'works on a BBS', ->
      a = new Article ArticleData.bbs
      user = a.parseUser DOM.bbs
      expect(user.data.username).to.equal 'evamana'
      expect(user.data.name).to.equal '조광연'

    it 'returns an user of another class', ->
      a = new Article ArticleData.abbs
      user = a.parseUser DOM.abbs
      expect(user).to.be.instanceof AnonymousUser
      expect(user.data.anonymous_name).to.equal '제환'
      expect(user.data.anonymous_email).to.equal 'randy-whang@hanmail.net'

    it 'works on a PDS of course', ->
      a = new Article ArticleData.pds
      user = a.parseUser DOM.pds
      expect(user.data.username).to.equal 'yjy3601'
      expect(user.data.name).to.equal '지니언냐'

    it 'even works on a Photo Album', ->
      a = new Article ArticleData.album
      user = a.parseUser DOM.album
      expect(user.data.username).to.equal 'rammy77'
      expect(user.data.name).to.equal '김보람'


  describe 'parseContent', ->

    it 'works on a BBS', ->
      a = new Article ArticleData.bbs
      c = a.parseContent DOM.bbs
      expect(c.title).to.equal '♪알림♪ 2011 So What Big Band OPEN!!'
      expect(c.text).to.include '악보를 읽는 능력, 표현하는 능력, 다른 악기들과 조화로운 소리를'
      expect(+c.created_at).to.equal +moment('2011-03-07 PM 11:15:33 +0900', 'YYYY-MM-DD A h:mm:ss Z').toDate()
      expect(c.hit_count).to.equal 134

    it 'also works on an Anonymous BBS', ->
      a = new Article ArticleData.abbs
      c = a.parseContent DOM.abbs
      expect(c.title).to.equal '근황보고겸 그냥 올리고 싶어서.(노출 심하니 원치않는분 보지마세요.)'
      expect(c.text).to.include '정공준비 재밌게 하세요.'
      expect(+c.created_at).to.equal +moment('2010-10-09 AM 11:40:05 +0900', 'YYYY-MM-DD A h:mm:ss Z').toDate()
      expect(c.hit_count).to.equal 84

    it 'works on a PDS of course', ->
      a = new Article ArticleData.pds
      c = a.parseContent DOM.pds
      expect(c.title).to.equal '[아트팀] 전체 세션 명단 & 팜플렛용 명단정리 (최종)'
      expect(c.text).to.include '재경아'
      expect(+c.created_at).to.equal +moment('2010-11-17 AM 12:52:04 +0900', 'YYYY-MM-DD A h:mm:ss Z').toDate()
      expect(c.hit_count).to.equal 55

    it 'even works on a Photo Album', ->
      a = new Article ArticleData.album
      c = a.parseContent DOM.album
      expect(c.title).to.equal '20110309스트릿'
      expect(c.text).to.include '스트릿 사진은 귀한것이여'
      expect(+c.created_at).to.equal +moment('2011-03-09 PM 10:49:19 +0900', 'YYYY-MM-DD A h:mm:ss Z').toDate()
      expect(c.hit_count).to.equal 102

    it.only 'should work with malformed html', ->
      a = new Article ArticleData.album2
      c = a.parseContent DOM.album2
      expect(c.title).to.equal 'MT >.<'
      expect(+c.created_at).to.equal +moment('2005-02-18 PM 6:52:13 +0900', 'YYYY-MM-DD A h:mm:ss Z').toDate()
      expect(c.hit_count).to.equal 77


  describe 'parseReplyInfo', ->

    it 'determines its parent', ->
      a = new Article ArticleData.reply
      replyInfo = a.parseReplyInfo DOM.reply
      expect(replyInfo.parent_id).to.equal '133291084'
      expect(replyInfo.ref_order).to.equal 2
      expect(replyInfo.ref_depth).to.equal 2

    it 'returns own id if not a reply', ->
      a = new Article ArticleData.bbs
      replyInfo = a.parseReplyInfo DOM.bbs
      expect(replyInfo.parent_id).to.equal a.data.id
      expect(replyInfo.ref_order).to.not.exist
      expect(replyInfo.ref_depth).to.not.exist


  describe 'parseComments', ->

    it 'works on a BBS', ->
      a = new Article ArticleData.bbs
      cs = a.parseComments DOM.bbs
      expect(cs).to.have.length 7
      expect(cs[0]).to.be.an.instanceof Comment
      expect(cs[0].data._user.data.name, 'name').to.equal '김보람'
      expect(cs[0].data._user.data.username, 'username').to.equal 'rammy77'
      expect(cs[0].data.text).to.equal 'ㅎㅎ 오와 오픈이다'
      expect(+cs[0].data.created_at).to.equal +moment('2011-03-07 23:56:38 +0900', 'YYYY-MM-DD HH:mm:ss Z').toDate()

    it 'also works on an Anonymous BBS', ->
      a = new Article ArticleData.abbs
      cs = a.parseComments DOM.abbs
      expect(cs).to.have.length 5

      c = cs[cs.length - 1]
      expect(c).to.be.an.instanceof Comment
      expect(c.data.anonymous_name).to.equal '구에르삼'
      expect(c.data.anonymous_email).to.equal 'guersam@guers.am'
      expect(c.data.text).to.equal '우왕 ㅋㅋㅋ'
      expect(+c.data.created_at).to.equal +moment('2013-02-01 13:39:39 +0900', 'YYYY-MM-DD HH:mm:ss Z').toDate()
      

    it 'works on a PDS of course', ->
      a = new Article ArticleData.pds
      cs = a.parseComments DOM.pds
      expect(cs).to.have.length 5

    it 'even works on a Photo Album', ->
      a = new Article ArticleData.album
      cs = a.parseComments DOM.album
      expect(cs).to.have.length 3


  describe 'parseAttachments', ->

    it 'works on a PDS of course', ->
      a = new Article ArticleData.pds
      as = a.parseAttachments DOM.pds

      expect(as).to.have.length 2
      expect(as[1].data.url).to.equal BASEURL.PDS+'/PDS/CsPDSDownload.asp?GrpId=509950&ObjSeq=3&SeqNo=558&DocId=31400855&FileSize=30208&FileName=%C0%FC%C3%BC%BC%BC%BC%C7%B8%ED%B4%DC%2Ehwp'


  describe 'parsePhotos', ->
    
    it 'works on a BBS', ->
      a = new Article ArticleData.bbsPhoto
      ps = a.parsePhotos DOM.bbs_photo
      expect(ps).to.have.length 1
      expect(ps[0].data.url).to.equal 'http://editor.freechal.com/GetFile.asp?mnf=509950*GCOM02*1*133773833*165132322454484858_asdf.PNG'

    it 'works on a Photo Album of course', ->
      a = new Article ArticleData.album
      ps = a.parsePhotos DOM.album
      
      expect(ps).to.have.length 3
      expect(ps[1].data.url).to.equal BASEURL.IMG+'/Album/GetImage.asp?grpid=509950&objseq=1&file=2435%5FIMG%5F0357%2Ejpg'
