'use strict';

/* Services */

var richardplatzServices = angular.module('richardplatzServices', ['ngResource']);

richardplatzServices.factory('$userComment', ['$resource',
    function ($resource) {
        return $resource('http://api.yourkiez.de/comments.json', {}, {
            query: {
                method: 'GET',
                cache: true
            }
        });
    }]);
