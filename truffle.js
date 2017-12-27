// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      from: '0xfea62d5040c90d8733405952624fbbbdcd34fb27',
      network_id: '*', // Match any network idz
      gas: 2500000
    }
  }
}
