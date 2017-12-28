'use strict';

angular.module('webUI')
    .controller('campaignController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {
            var that = this;

            that.$onInit = function() {
                if (that.campaign) {
                    // campain 0 -> address to send funds
                    var addressTo = that.campaign[0];
                    // campain 1 -> goal of campaign
                    var goal = that.campaign[1].c[0];
                    // campain 2 -> days of campaign
                    var days = that.campaign[2].c[0];
                    // campain 4 -> amount gathered
                    var amount = web3.fromWei(that.campaign[4].c[0],'ether');

                    $scope.campaign = {
                            'title': addressTo,
                            'goal': goal,
                            'completed': '32%',
                            'deadline': days,
                            'amount': amount,
                            'address': addressTo,
                            'id': that.cid,
                    }
                }

            }

            $scope.contribute = function() {
                var value = web3.toWei('1','ether');
                $rootScope.contract.contribute(this.campaign.id, {value: value}, function(error, result){
                      if(!error)
                      {
                          console.log(result);
                      }
                      else
                      {
                          console.error(error);
                      }
                 });

            }
        }
    ]);
