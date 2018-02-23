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
            }).state('create', {
                url: '/create',
                templateUrl: 'templates/create.html',
                controller: 'createController',
                data: {
                  locationName: 'Create Campaign'
                }
            }).state('view', {
                url: '/view',
                templateUrl: 'templates/view.html',
                controller: 'masterController',
                data: {
                  locationName: 'View Campaigns'
                }
            });
    }
]);
