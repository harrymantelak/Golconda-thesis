'use strict';

angular.module('webUI')
    .controller('campaignController', ['$scope', '$state', '$rootScope',
        function($scope, $state, $rootScope) {
            var that = this;

            that.$onInit = function() {
                // campain 0 -> address to send funds
                var addressTo = that.campaign[0];
                // campain 1 -> goal of campaign
                var goal = that.campaign[1].c[0];
                // campain 2 -> days of campaign
                var days = that.campaign[2].c[0];
                console.log(that.campaign);
                $scope.campaign = {
                        'id': '1',
                        'title': addressTo,
                        'goal': goal,
                        'completed': '32%',
                        'deadline': days,
                        'amount': '32'
                }

            }
        }
    ]);
