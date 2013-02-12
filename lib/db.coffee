dbConfig = require '../database.json'
config   = dbConfig[process.env.NODE_ENV || 'development']
config.database = process.env.COMMUNITY if process.env.COMMUNITY

path    = require 'path'
fs      = require 'fs'
shelljs = require 'shelljs'

_     = require 'lodash'
mysql = require 'mysql'
pool  = require('generic-pool').Pool {
  name   : 'mysql'
  create : (callback) ->
    conn = mysql.createConnection config
    conn.connect()
    callback null, conn
  destroy           : (client) -> client.end()
  max               : 10
  idleTimeoutMillis : 30000
  log               : false
}


obj2sql = (where, joiner = 'AND') ->
  ("#{key}=#{mysql.escape val}" for key, val of where).join " #{joiner} "

_find = (con, [TABLE_NAME, where], callback) ->
  where = obj2sql where
  where = 'WHERE ' + where unless where == ''
  con.query "SELECT * FROM #{TABLE_NAME} #{where} LIMIT 1", (err, rows) =>
    callback err, rows?[0]

find = pool.pooled _find

findAll = pool.pooled (con, [TABLE_NAME, where], callback) ->
  where = obj2sql where
  where = 'WHERE ' + where unless where == ''
  con.query "SELECT * FROM #{TABLE_NAME} #{where}", callback

all = pool.pooled (con, TABLE_NAME, callback) ->
  con.query "SELECT * FROM #{TABLE_NAME}", callback

findOrCreate = pool.pooled (con, [TABLE_NAME, where, data], callback) ->
  _find con, [TABLE_NAME, where], (err, existing) ->
    if err || existing
      return callback err, existing
    
    con.query "INSERT INTO #{TABLE_NAME} SET ?", data, (err, res) ->
      if err then return callback err
      unless res.insertId
        callback new Error 'No insert id'
        return
      newData = _.extend {id: res.insertId}, data
      callback null, newData

remove = pool.pooled (con, [TABLE_NAME, where], callback) ->
  where = obj2sql where
  if where == ''
    throw new Error 'no where clause in delete'
  con.query "DELETE FROM #{TABLE_NAME} WHERE #{where}", callback

update = pool.pooled (con, [TABLE_NAME, where, data], callback) ->
  data  = obj2sql data, ','
  where = obj2sql where
  con.query "UPDATE #{TABLE_NAME} SET #{data} WHERE #{where}", (err, res) ->
    callback err, !! res?.affectedRows


class DAO
  TABLE_NAME: null

  all : (callback) =>
    all @TABLE_NAME, callback

  find: (where, callback) =>
    find [@TABLE_NAME, where], callback

  findAll: (where, callback) =>
    findAll [@TABLE_NAME, where], callback

  findOrCreate: (where, data, callback) =>
    findOrCreate [@TABLE_NAME, where, data], callback

  update : (where, data, callback) =>
    update [@TABLE_NAME, where, data], callback

  remove: (where, callback) =>
    remove [@TABLE_NAME, where], callback


class User extends DAO
  TABLE_NAME: 'users'

class Board extends DAO
  TABLE_NAME: 'boards'

  countPages: pool.pooled (con, id, callback) ->
    con.query """
      SELECT CEIL(COUNT(*) / #{Article::PER_PAGE}) AS cnt 
      FROM articles WHERE board_id = ?
    """, [id], (err, rows) ->
      callback err, rows?[0].cnt
  
class Article extends DAO
  TABLE_NAME: 'articles'

  PER_PAGE : 20

  findFull: pool.pooled (con, id, callback) ->
    con.query """
      SELECT a.*, u.id as user_id,
        IFNULL(u.name, a.anonymous_name) AS author,
        DATE_FORMAT(a.created_at, '%Y-%m-%d %h:%m:%s') as created_at
      FROM #{Article::TABLE_NAME} a
      LEFT JOIN #{User::TABLE_NAME} u ON u.id = a.user_id
      WHERE a.id = ?
      LIMIT 1
    """, [id], (err, res) ->
      callback err, res?[0]

  findReplies: pool.pooled (con, callback) ->
    con.query "SELECT * FROM #{Article::TABLE_NAME} WHERE NOT ISNULL(parent_id) AND ref_depth = 0", callback

  findNoCommentUser: pool.pooled (con, callback) ->
    con.query """
      SELECT a.* 
      FROM articles a
      INNER JOIN comments c ON a.id = c.article_id AND c.user_id = 0
      GROUP BY a.id
    """, callback

  findIrregularDate: pool.pooled (con, callback) ->
    con.query """
      SELECT a.*, b.type FROM articles a
      JOIN boards b ON b.id = a.board_id
      WHERE a.created_at < '1971-01-01'
    """, callback

  findDuplicatedIds: pool.pooled (con, callback) ->
    con.query "select u.url from (select b.url, count(*) as cnt from articles b group by b.url) u where u.cnt > 1", (err, rows) ->
      if rows.length == 0
        return callback null, []
      urls = _.pluck(rows, 'url').join "','"
      con.query "select * from articles where url in ('#{urls}') order by url asc, id asc", callback

  getList: pool.pooled (con, opt, callback) ->
    limitStart = (opt.page - 1) * Article::PER_PAGE
    con.query """
      SELECT 
        a.*, u.username, u.id AS user_id,
        IFNULL(u.name, a.anonymous_name) AS author,
        DATE_FORMAT(a.created_at, '%Y-%m-%d') as created_at
      FROM articles a
      LEFT JOIN users u ON u.id = a.user_id
      WHERE board_id = #{opt.boardId}
      ORDER BY a.parent_id, a.ref_order
      LIMIT #{limitStart}, #{Article::PER_PAGE}
    """, callback


class Comment extends DAO
  TABLE_NAME: 'comments'
  
class Photo extends DAO
  TABLE_NAME: 'photos'

class Attachment extends DAO
  TABLE_NAME: 'attachments'


prepareTables = (dbName, callback) ->
  DB_GEN_QUERY = "CREATE DATABASE IF NOT EXISTS #{dbName} CHARACTER SET utf8 COLLATE utf8_general_ci;"
  TABLE_GEN_QUERY = fs.readFileSync(path.join __dirname, '../migrations/up.sql')
  shelljs.exec "mysql -uroot -e '#{DB_GEN_QUERY}'", (err, res) ->
    if err then return callback err
    shelljs.exec "mysql -uroot -e 'source migrations/up.sql' #{dbName}", callback


module.exports =
  user       : new User
  board      : new Board
  article    : new Article
  comment    : new Comment
  photo      : new Photo
  attachment : new Attachment
  prepareTables : prepareTables
