const { EventEmitter } = require('events')
const mediator = new EventEmitter()
const { connect, ObjectId } = require('./database')
const { config } = require('./config')
const { initDI } = require('./di')
const server = require('./server')
const repo = require('./repo')
const models = require('./models')

console.log('-- Posts Service')
console.log('Connecting to repository...')

process.on('uncaughtException', err => {
  console.error('Unhandled Exception', err)
})

connect(config, mediator)
mediator.on('db.err', err => {
  console.log(err)
})
mediator.on('db.ready', db => {
  console.log('Connected repository, init DI')
  const { dbSettings, serverSettings, serverHelper } = config
  initDI({
    dbSettings,
    serverSettings,
    repo: repo.connect(db, { ...config, ObjectId }),
    models,
    serverHelper
  }, mediator)
})

mediator.on('di.ready', container => {
  console.log('di ready, start app')
  server.start(container).then(app => {
    console.log('Server start at port ', app.address().port)
  })
})

mediator.on('di.error', err => {
  console.log('di error,', err)
})