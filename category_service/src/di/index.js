const { createContainer, asValue } = require('awilix')

const initDI = ({ dbSettings, serverSettings, repo, models, serverHelper }, mediator) => {
  console.log('init DI')
  const container = createContainer()
  container.register({
    repo: asValue(repo),
    dbSettings: asValue(dbSettings),
    models: asValue(models),
    serverSettings: asValue(serverSettings),
    serverHelper: asValue(serverHelper)
  })
  mediator.emit('di.ready', container)
}

module.exports = { initDI }
