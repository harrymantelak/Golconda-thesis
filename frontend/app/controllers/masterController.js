'use strict';

/**
 * Master Controller
 */

angular.module('webUI')
    .controller('masterController', ['$state', '$scope', '$cookieStore', '$location', '$rootScope', 'appData', masterController]);

function masterController($state, $scope, $cookieStore, $location, $rootScope, appData) {
    /**
     * Cookie Control
     */
    $scope.data = appData;

    if (typeof $state.current.data !== 'undefined'){
      $scope.locationName = $state.current.data.locationName;
    }

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    window.onresize = function() {
      $scope.$apply();
    };

    $scope.changeView = function(view){
      $state.transitionTo(view);
    }

}
