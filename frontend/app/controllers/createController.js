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
                $rootScope.contract.newCampaign(address, funds, days, $rootScope.args);
                $state.transitionTo('view');
            };
        }
    ]);