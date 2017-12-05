'use strict';

angular.module('webUI')
    .controller('charityController', ['$scope', '$state',
        function($scope, $state) {
        // TEST DATA TO BE REMOVED
        $scope.charity = {
                'id': '1',
                'title': 'Charity 1',
                'goal': '100',
                'completed': '32%',
                'deadline': '',
                'amount': '32'
            }
        }
    ]);
