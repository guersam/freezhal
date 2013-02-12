urlLib = require 'url'
async  = require 'async'
_      = require 'lodash'
db     = require './db'
utils  = require './utils'
logger = require './logger'
{get, getDom, post, download} = require './connect'

COUNT =
  num : {}
  inc : (name) ->
    COUNT.num[name] ||= 0
    COUNT.num[name]++

Freechal =
  svrLink : require './dom/svrLink.json'

class Entity
  TAG: '_Entity_'
  MAX_CONCURRENCY: 1
  constructor: (data) ->
    if data
      @data = _.clone data
      @url  = data.url || data
    logger.verbose @TAG, "created"
    this

  visit: (callback) =>
    getDom @url, (err, $) =>
      @save (err, obj) =>
        @data.id = obj.id if obj?.id

        @getChildren $, (err, children = []) =>
          async.forEachLimit children, @MAX_CONCURRENCY, (
            (c, fn2) -> c.visit fn2
          ), callback

  save : (callback) => callback null, this
  getChildren : (_$, callback) => callback null, []


class Site extends Entity
  
  TAG: '[Site]'

  BOARD_TYPES: ['BBS', 'ABBS', 'Notice', 'EstimBBS', 'Album', 'PDS']

  genMenu : ($) ->
    window = $.window

    # add global variables for links
    _.extend window, Freechal.svrLink

    # extract menu info from script tags
    varScript = $('script').filter (idx, s) -> s.innerHTML.match /var g_menuinfo/
    vars = $(varScript)
      .text()
      .split(/(\r\n|\r|\n)var/)
    
    vars.forEach (v) ->
      if v != '\n'
        i = v.indexOf('=')
        if i != -1
          [key, val] = [v.slice(0, i).trim(), v.slice(i+1).trim()]
          window[key] = eval val

    # replace content of body with menu
    html = "<ul>"
    window.document.write = (tag) -> html += tag
    window.DisplayMenuInfo()
    $('body').html html

  genBoardDataFromLink: ($a) ->
    urlObj = urlLib.parse $a.attr('href'), true
    {
      url   : urlObj.href
      title : $a.text().trim()
      type  : urlObj.path.match(/Activity\/(.+)\/Cs/)?[1]
      grp   : $a.closest('[class^=folder]').children('[id^=groupTitle]').text().trim() || null
      pages_total : 0
      pages_saved : 0
    }

  getChildren : ($, callback) =>
    logger.verbose @TAG, 'getChildren'

    @genMenu $

    children = []
    $('a[href*="/Activity/"]').each (i, a) =>
        data = @genBoardDataFromLink $ a

        if data.type in @BOARD_TYPES
          children.push new Board data
        else if data.type == 'SmallGroup'
          if data.url.match /CsAliSmlActivity\.asp/
            children push new SmallGroup data
          else if data.url.match /CsAliSmlList\.asp/
            children.push new SmallGroupList data

    callback null, children

  visit : (callback) =>
    super (err) ->
      callback err, COUNT.num


class SmallGroupList extends Entity
  TAG: 'SmallGroupList'

  BASEURL : 'http://home.freechal.com/ComService/Activity/SmallGroup/'

  getChildren : ($, callback) =>
    logger.verbose @TAG, 'getChildren'

    children = []
    $('a[href*=CsAliSmlActivity]', '#ContentsMain').each (i, a) =>
      $a  = $ a
      data =
        url : @BASEURL+ $a.attr 'href'
        grp : '소그룹: ' + $a.text().trim()
      children.push new SmallGroup data

    callback null, children


class SmallGroup extends Entity
  TAG: 'SmallGroup'

  getChildren : ($, callback) =>
    logger.verbose @TAG, 'getChildren'

    children = []
    $('a[href*="/Activity/"]', '#ContentsMain').each (i, a) =>
      data = Site::genBoardDataFromLink $ a
      data.grp = @data.grp

      if data.type in Site::BOARD_TYPES
        children.push new Board data

    callback null, children


class Board extends Entity
  TAG: '[Board]'

  MAX_PAGES : 10000

  genPageUrl: (idx) =>
    "#{@url}&PageNo=#{idx}"

  # Calculabe last page number using binary search
  getTotalPages: (callback) =>
    logger.info @TAG, 'Counting pages...'

    if @data.pages_total
      callback null, @data.pages_total

    l = 1
    r = @MAX_PAGES
    i = null
    step = (fn) =>
      i = ((l + r) / 2) | 0
      logger.verbose "[Board::getTotalPages]", "#{l} #{i} #{r}"
      getDom @genPageUrl(i), (err, $) =>
        if err then return fn err
        if $('img[src*="image.freechal.com/etc/NoPerm"]', '#ContentsMain').length > 0
          logger.warn @TAG, "No permission for #{@data.title}"
          return callback null, 0

        if i == 1 && $('tr.nolist', '#BoardTdList').length > 0
          logger.warn @TAG, "#{@data.title} is empty"
          return callback null, 0

        if $('#Page').children().length == 0 # page is empty
          r = i
          process.nextTick step
        else if $('img.pg-next').length > 0 # next page exists
          l = i
          process.nextTick step
        else
          current = parseInt($('span.pgon').text()) || 0
          last    = parseInt($('a.pg:last').text()) || 0
          callback null, Math.max current, last
    step()

  save: (callback) =>
    logger.verbose @TAG, 'save'
    db.board.findOrCreate {url: @url}, @data, (err, board) =>
      if err
        logger.error @TAG, err
        console.log @data
        throw err

      _.extend @data, board
      if board.pages_total
        return callback null
      else
        @getTotalPages (err, totalPages) =>
          @data.pages_total = totalPages
          db.board.update {id: @data.id}, {pages_total: totalPages}, callback


  getChildren: ($, callback) =>
    logger.verbose @TAG, 'getChildren'

    pageStart = @data.pages_saved + 1
    pageEnd   = @data.pages_total
    logger.info @TAG, "title: #{@data.title}, pages: (#{@data.pages_saved}/#{pageEnd})"
    if pageStart <= pageEnd
      children = for i in [pageStart .. pageEnd]
        opt =
          num      : i
          board_id : @data.id
          type     : @data.type
          url      : @genPageUrl i
        new Page opt
    callback null, children
        
  visit : (callback) =>
    super (err) =>
      COUNT.inc 'board'
      callback err

class Page extends Entity
  TAG: '[Page]'

  MAX_CONCURRENCY: 3

  constructor: (data) ->
    super data
    i = @url.lastIndexOf('/')
    @baseUrl = @url.slice(0, i+1)
  
  getChildren: ($, callback) =>
    children = []
    $('.notice-list, .img-box').remove()
    $('#ContentsMain td a[href^="Cs"]').each (i, a) =>
      $a = $(a)
      opt =
        board_id : @data.board_id
        type     : @data.type
        url      : @baseUrl + $a.attr('href')

      children.push new Article opt
    callback null, children

  visit : (callback) =>
    super (err) =>
      if err then return callback err
      db.board.update {id: @data.board_id}, {pages_saved: @data.num}, callback


class Article extends Entity
  TAG: '[Article]'

  constructor: (data) ->
    super data
    @type = @data.type
    @isAnonymous = @type == 'ABBS'
    @data.id = utils.getDocIdFromUrl @url
    # TODO assign one table to each board type instead of using this dirty hack
    #if @type == 'PDS' && @data.id == 'something conflicted'
    #  @data.id = ''+ (parseInt(@data.id)-1)
    delete @data.type

  parseUser: ($) =>
    logger.verbose @TAG, 'parseUser'

    if @isAnonymous
      $user = $('.td_writer')
      data =
        anonymous_name: $user.text().trim()

      if ($a = $user.find('a')).length > 0
        urlObj = urlLib.parse $a.attr('href'), true
        data.anonymous_email = urlObj.query.to

      new AnonymousUser data
    else
      $user = $('span', '.td_writer')

      unless $user.length
        if ($guest = $('#WriterCT, .td_writer')).length
          logger.warn "#{@TAG}::parseUser", @url
          n = $guest.text().trim()
          return new User {username: n, name: n}
        logger.error "#{@TAG}::parseUser", @url
        throw new Error @url

      data =
        name     : $user.text().trim()
        username : $user.attr('onClick').split("','")[2]
      
      new User data

  parseContent: ($) =>
    logger.verbose @TAG, 'parseContent'
    data =
      title: $('.td_title').clone() # Workaround for nested <td> tags
        .children().remove().end()
        .text().trim()
      created_at: utils.parseDatetime $('.td_date').text()
      hit_count: parseInt $('#td_hit .num').text()

    data.text =
      if @type == 'Album'
        $('.cont-view:first').html()?.trim() || ''
      else
        $('#DocContent').html()?.trim() || ''

    _.extend data, @parseReplyInfo $
    data

  parseReplyInfo : ($) =>
    logger.verbose @TAG, 'parseReplyToUrl'
    $current = $('b', '#prev-next').closest('tr')
    if $current.length == 0 || $current.is('.prev') # not a reply
      if @type == 'Album'
        null
      else
        { parent_id : @data.id }
    else
      {
        parent_id : utils.getDocIdFromUrl $current.parent().find('.prev a').attr('href')
        ref_depth : $current.find('td img[src$="blank.gif"]').length + 1
        ref_order : $current.prevAll().length
      }

  save: ($, user, callback) =>
    logger.verbose @TAG, 'save'

    _.extend @data, @parseContent $
    if @isAnonymous
      _.extend @data, user.data
    else
      unless user.id
        logger.error 'NoUser', @url
        throw new Error 'NO USER'
      @data.user_id = user.id

    if @data.id is undefined
      delete @data.id
    db.article.findOrCreate(url: @url, @data, callback)

  parseComments: ($, articleId) =>
    logger.verbose @TAG, 'parseComments'

    comments = []
    $('.CommentList tr').each (i, tr) =>
      $tr = $ tr
      data =
        article_id : articleId
        text : $tr.children('.cmtxt').clone() # workaround for nested <td> tags
          .children().remove().end()
          .text().trim()
        created_at : utils.parseDatetime $tr.find('.day').text().trim()

      $user = $tr.children('.nicname')
      parseAnonymousUser = ->
        data.anonymous_name = $user.text().trim()
        if $a = $tr.find('a')
          data.anonymous_email = $a.attr('href').split("'")[1]

      if @isAnonymous
        do parseAnonymousUser
      else
        userLinkInfo = $user.children('span').attr('onClick')?.split("','") || []
        if userLinkInfo[2] && userLinkInfo[3]
          data._user = new User {
            username : userLinkInfo[2]
            name     : userLinkInfo[3]
          }
        else
          do parseAnonymousUser
      comments.push new Comment data
    comments

  parseAttachments: ($, articleId) =>
    logger.verbose @TAG, 'parseAttachments'
    attachments = []

    $('li a', '.attachments_file').each (idx, a) ->
      $a = $ a
      data =
        article_id : articleId
        url        : $a.attr 'href'
      attachments.push new Attachment data
    attachments

  parsePhotos: ($, articleId) =>
    logger.verbose @TAG, 'parsePhotos'
    photos = []
    $('img[src^=http]', '#view-content, #DocContent').each (idx, img) ->
      data =
        article_id : articleId
        url        : $(img).attr 'src'
      photos.push new Photo data
    photos

  visit : (callback) =>
    logger.verbose @TAG, 'visit'
    getDom @url, (err, $) =>

      @parseUser($).save (err, user) =>
        logger.verbose @TAG, 'user'
        if err
          console.log err
          logger.error User::TAG, err
          return callback err

        @save $, user, (err, article) =>
          if err
            console.log err
            logger.error @TAG, err
            return callback err

          unless article.id
            logger.error @TAG, @url
            return callback new Error

          tasks = _([
            @parseComments($, article.id)
            @parseAttachments($, article.id)
            @parsePhotos($, article.id)
          ]).flatten().compact().value()

          async.forEachLimit tasks,
            @MAX_CONCURRENCY,
            ((t, fn) -> t.save fn),
            (err, res) =>
              if err
                console.log err
                logger.error @TAG, err
                return callback err

              logger.info @TAG, "saved: #{@data.title}"
              COUNT.inc 'article'
              callback null


class AbstractUser extends Entity

class AnonymousUser extends AbstractUser
  TAG : '[AnonymousUser]'

class User extends AbstractUser
  TAG  : '[User]'
  save : (callback) =>
    logger.verbose @TAG, 'save'
    logger.verbose 'Usersave', @data
    {username} = @data
    db.user.findOrCreate({username}, @data, callback)


class Comment extends Entity
  TAG  : '[Comment]'
  save : (callback) =>
    logger.verbose @TAG, 'save'
    COUNT.inc 'comment'
    if (@data._user)
      @data._user.save (err, user) =>
        if err then return callback err
        delete @data._user
        @data.user_id = user.id
        where = _.pick @data, 'article_id', 'user_id', 'text'
        db.comment.findOrCreate(where, @data, callback)
    else
      db.comment.findOrCreate(@data, @data, callback)


class File extends Entity
  TAG  : '[File]'
  dir  : null
  dao  : null
  save : (callback) =>
    logger.verbose @TAG, 'save'
    download @url, @dir, @data.article_id, (err, path) =>
      if err then return callback null

      @data.path = path
      COUNT.inc @dir
      logger.info @TAG, "saved: #{path}"
      @dao.findOrCreate({url: @url}, @data, callback)

class Photo extends File
  TAG: '[Photo]'
  dir: 'photo'
  dao: db.photo

class Attachment extends File
  TAG: '[Attachment]'
  dir: 'attachment'
  dao: db.attachment


module.exports = {
  Site, Board, Page, Article, Photo,
  Comment, Attachment, User, AnonymousUser
}
