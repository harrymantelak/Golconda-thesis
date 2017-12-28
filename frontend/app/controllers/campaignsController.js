'use strict';

angular.module('webUI')
    .controller('campaignsController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {

            $scope.campaigns = [];
            var that = this;

            that.$onInit = function() {
                $rootScope.contract.numCampaigns({}, function(error, result){
                  if(!error)
                  {
                      var num = result.c[0];
                      for (var i = 0; i < num; i++)
                      {
                          $rootScope.contract.campaigns(i, function(error, result){
                            if(!error)
                            {
                                $scope.campaigns.push(result);
                                console.log(result);
                                console.log($scope.campaigns);

                                $scope.$apply();
                            }
                            else
                            {
                                console.error(error);
                            }
                        });
                      }
                  }
                  else
                  {
                      console.error(error);
                  }
                });
            }
        }
    ]);
