const dbSettings = {
  db: process.env.DB || 'categories',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : [
    '127.0.0.1:27017'
  ],
  dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    readPreference: 'secondaryPreferred',
    native_parser: false
  }),
  serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }),
  replsetParameters: (replset = 'rs0') => ({
    replicaSet: replset,
    ha: true,
    haInterval: 10000,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  })
}

const serverSettings = {
  port: process.env.PORT || 3002,
  shakey: '$123@456',
  version: 'v1'
}

const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const { shakey } = serverSettings

  const encodePassword = (pass) => {
    return pass
  }

  const validateToken = (token) => {
    try {
      return jwt.verify(token, shakey)
    } catch (ex) {
      return null
    }
  }

  const getUserToken = (user) => {
    return jwt.sign({ ...user }, shakey, { expiresIn: '24h' })
  }

  return { encodePassword, validateToken, getUserToken }
}
module.exports = { dbSettings, serverHelper: serverHelper(), serverSettings }
