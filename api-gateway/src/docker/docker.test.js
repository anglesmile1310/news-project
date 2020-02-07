function test () {
  return new Promise((resolve, reject) => {
    resolve({
      1: {
        id: 1,
        route: '/api/v1/user',
        target: 'http://192.168.3.242:3002'
      },
      2: {
        id: 2,
        route: '/api/v1/post',
        target: 'http://192.168.3.242:3004'
      },
      3: {
        id: 3,
        route: '/api/v1/category',
        target: 'http://192.168.3.242:3003'
      }
    })
  })
}

module.exports = { test }
