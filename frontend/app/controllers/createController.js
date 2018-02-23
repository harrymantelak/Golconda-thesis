'use strict';

angular.module('webUI')
    .controller('createController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {
            var that = this;

            $scope.campaign = {};

            $scope.submit = function() {
                var address = $scope.campaign.address;
                var funds = $scope.campaign.funds;
                var days = $scope.campaign.days;
                var description = $scope.campaign.description;
                var name = $scope.campaign.name;

                $rootScope.contract.newCampaign(address, funds, days, name, description, function(error, result){
                      if(!error)
                      {
                          $state.transitionTo('view');
                      }
                      else
                      {
                          console.error(error);
                      }
                 });
             }
        }
    ]);
