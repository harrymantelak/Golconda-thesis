
// Define the `webUI` module
var app = angular.module('webUI', [
  'ngAnimate',
  'ngTouch',
  'ui.router',
  'ui.bootstrap',
  'ngCookies',
]);

app.factory('appData', ['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {

  var service = {
    model: {
      toggle: true,
    },
    SaveState: function() {
      sessionStorage.appData = angular.toJson(service.model);
    },

    RestoreState: function() {
      service.model = angular.fromJson(sessionStorage.appData);
    },

    toggle: function() {
      service.model.toggle = !service.model.toggle;
    },

    logIn: function(user) {
      var today = new Date();
      var expiresValue = new Date(today);
      expiresValue.setSeconds(today.getSeconds() + 3600);
      $cookieStore.put('user', user, {
        'expires': expiresValue
      })
      return;
    }
  }

  $rootScope.$on("savestate", service.SaveState);
  $rootScope.$on("restorestate", service.RestoreState);

  return service;
}]);

app.run(['$rootScope', '$state', '$cookieStore', 'appData', function($rootScope, $state, $cookieStore, appData) {
    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));\

    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like Metamask");
      // Use Mist/MetaMask's provider
      web3 = new Web3(web3.currentProvider);
      web3.version.getNetwork((err, netId) => {
          switch (netId) {
            case "1":
              console.log('This is mainnet');
              break
            case "2":
              console.log('This is the deprecated Morden test network.');
              break
            case "3":
              console.log('This is the ropsten test network.');
              break
            default:
              console.log('This is an unknown network.');
          }
        })

      var inter=
      '[{"constant":true,"inputs":[{"name":"campaignID","type":"uint8"}],"name":"totalFundsFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toggleContractActive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"campaigns","outputs":[{"name":"beneficiary","type":"address"},{"name":"id","type":"uint256"},{"name":"fundingGoal","type":"uint256"},{"name":"fundingDeadlineBlock","type":"uint256"},{"name":"numFunders","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numCampaigns","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"checkGoalReached","outputs":[{"name":"reached","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"contribute","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"goal","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"}],"name":"newCampaign","outputs":[{"name":"campaignID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"version_number","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"campaignID","type":"uint256"}],"name":"NewFunder","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"beneficiary","type":"address"},{"indexed":false,"name":"fundingGoal","type":"uint256"},{"indexed":false,"name":"fundingDeadlineBlock","type":"uint256"}],"name":"NewCharity","type":"event"}]';

      abi = JSON.parse(inter);
      var CharityContract = web3.eth.contract(abi);
      var contractInstance = CharityContract.at('0x4ADcc0bbf74211C2B8B227DcBac0BE12cd92106A');

      console.log(contractInstance);

      $rootScope.contract = contractInstance;

      $rootScope.args = {from: web3.eth.accounts[0], gas:450000};
    }


}]);

var handleJSONFile = function (err, data) {
   if (err) {
      throw err;
   }
   markers = JSON.parse(data);
 }
