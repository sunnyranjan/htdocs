'use strict';

/* App Module */

var richardplatzApp = angular.module('richardplatzApp', [
    'ngRoute',
    'richardplatzAnimations',
    'richardplatzControllers',
    'richardplatzFilters',
    'richardplatzServices'
]);

richardplatzApp.config(['$routeProvider', '$mdThemingProvider',
    function ($routeProvider, $mdThemingProvider) {

        $mdThemingProvider.theme('lime')
            .primaryPalette('light-blue')
            .accentPalette('light-blue')
            .warnPalette('light-blue');

        $routeProvider.
            when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'homeController',
                controllerAs: 'vm',
                resolve: {
                    _categories: ['$http', function ($http) {
                        $http.get('http://api.yourkiez.de/categories.json').then(successCallback, errorCallback);
                        function successCallback (responseSuccess) {
                            return responseSuccess.data;
                        }
                        function errorCallback (responseError) {
                            return responseError.data;
                        }
                    }]
                }
            }).
            when('/projekt', {
                templateUrl: 'partials/projekt.html',
                controller: 'projektController',
                controllerAs: 'vm'
            }).
            when('/hilfe', {
                templateUrl: 'partials/hilfe.html',
                controller: 'hilfeController',
                controllerAs: 'vm'
            }).
            when('/comments', {
                templateUrl: 'partials/comments.html',
                controller: 'commentsController',
                controllerAs: 'vm'
            }).
            when('/projekt', {
                templateUrl: 'partials/impressum.html',
                controller: 'impressumController',
                controllerAs: 'vm'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);
