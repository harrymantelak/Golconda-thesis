'use strict';

angular
    .module('webUI')
    .component('campaign', {
        templateUrl: "templates/campaign.html",
        controller: "campaignController",
        bindings: {
            campaign: '='
        },
    });
