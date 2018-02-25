'use strict';

angular.module('webUI')
    .controller('campaignController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {
            var that = this;

            that.$onInit = function() {
                if (that.campaign) {
                    // campain 0 -> address to send funds
                    var addressTo = that.campaign[0];
                    // campain 1 -> id of campaign
                    var id = that.campaign[1].c[0];
                    // campain 2 -> goal of campaign
                    var goal = that.campaign[2].c[0];
                    // campain 3 -> days of campaign
                    var days = that.campaign[3].c[0];
                    // campain 4 -> number of funders
                    var funders = that.campaign[4].c[0];
                    // campain 5 -> amount gathered
                    var amount = web3.fromWei(that.campaign[5].c[0],'ether');
                    // campain 6 -> name
                    var name = that.campaign[6];
                    // campain 7 -> description
                    var description = that.campaign[7];

                    web3.eth.getBlockNumber(function (error, result) {
                      $scope.calcDuration(result, days);
                    });

                    $scope.campaign = {
                      'title': name,
                      'description': description,
                      'goal': goal,
                      'days': days,
                      'completed': '32%',
                      'amount': amount,
                      'address': addressTo,
                      'id': id,
                      'funders': funders,
                    }
                }

            }

            $scope.calcDuration = function(result, days) {
              var deadline = Math.max(0, Math.floor((days - result) / 5760));
              $scope.campaign.deadline = deadline;
              $scope.$apply();
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
