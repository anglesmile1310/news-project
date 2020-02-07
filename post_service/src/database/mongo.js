const MongoClient = require('mongodb')
const getMongoURL = (options) => {
  const url = options.servers
    .reduce((prev, cur) => prev + cur + ',', `mongodb://${options.user}:${options.pass}@`)
  return `${url.substr(0, url.length - 1)}/${options.db}`
}

const connect = (options, mediator) => {
  const { dbSettings } = options
  if (!dbSettings) throw new Error('missing dbSettings')
  const connection = getMongoURL(dbSettings);
  console.log(connection);

  MongoClient.connect(
    connection, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        return mediator.emit('db.error', err)
      }
      console.log(dbSettings.db);
      const db = client.db(dbSettings.db)
      mediator.emit('db.ready', db)
    })
}

module.exports = { connect }
