'use strict';

angular.module('webUI')
.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                controller: 'masterController',
                data: {
                  locationName: 'Dashboard'
                }
            });
    }
]);
