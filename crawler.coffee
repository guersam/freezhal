cluster = require 'cluster'

async   = require 'async'
moment  = require 'moment'

db      = require './lib/db'
{login} = require './lib/connect'
{Site}  = require './lib/entity'
logger  = require './lib/logger'
accounts = require './accounts.json'

if cluster.isMaster
  program = require 'commander'

  program
    .version('0.1.0')
    .parse(process.argv)

  envs = {}
  jobs = accounts.length

  cluster.on 'fork', (worker) ->
    worker.on 'message', (msg) ->
      if msg.id && msg.pass
        envs[worker.id] = msg

  cluster.on 'exit', (worker, code, signal) ->
    if code
      logger.warn "Worker died by error. restarting in 10 seconds..."
      setTimeout (-> cluster.fork envs[worker.id]), 10000
    else
      logger.info 'Done, congratulations!'
      if --jobs == 0
        logger.info 'ALL FINISHED!'
        process.exit 0

  for a in accounts
    env =
      id        : a.id
      pass      : a.pass
      url       : "http://home.freechal.com/#{a.COMMUNITY}"
      COMMUNITY : a.community
    cluster.fork env

else # cluster.isWorker
  env = process.env
  unless env.COMMUNITY
    throw new Error 'Community not set!'
  process.send env

  db.prepareTables env.COMMUNITY, (err, res) ->
    if err
      logger.error '[Worker]', err
      process.exit 1

    cred =
      id   : env.id
      pass : env.pass

    login cred, (err, success) ->
      if err
        logger.error '[Worker]', err
        process.exit 1

      new Site(url: env.url).visit (err) ->
        if err
          logger.error '[Worker]', err
          process.exit 1
        process.exit 0
