'use strict';

angular.module('webUI')
    .controller('campaignsController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {

            var num = $rootScope.contract.numCampaigns().c[0];
            $scope.campaigns = [];
            for (var i = 0; i < num; i++)
            {
                $scope.campaigns.push($rootScope.contract.campaigns(i));
            }
        }
    ]);
