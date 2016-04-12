'use strict';

/* App Module */

var richardplatzApp = angular.module('richardplatzApp', [
    'ngRoute',
    'richardplatzAnimations',
    'richardPlatzDirectives',
    'richardplatzControllers',
    'richardplatzFilters',
    'richardplatzServices'
]);

richardplatzApp.config(['$routeProvider', '$mdThemingProvider', '$locationProvider',
    function ($routeProvider, $mdThemingProvider, $locationProvider) {

        var neonRedMap = $mdThemingProvider.extendPalette('pink', {
            '500': 'E3217E'
        });
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('neonRed', neonRedMap);
        // Use that theme for the primary intentions
        $mdThemingProvider.theme('default')
            .primaryPalette('neonRed')

        $mdThemingProvider.theme('lime')
            .primaryPalette('light-blue')
            .accentPalette('light-blue')
            .warnPalette('light-blue');

        $routeProvider
            .when('/',{
                redirectTo: '/karte'
            })
            .when('/karte', {
                templateUrl: 'partials/home.html',
                controller: 'homeController',
                controllerAs: 'vm'/*,
                resolve: {
                    _categories: ['$http', '$q', function ($http, $q) {
                        var delay = $q.defer();
                        activate();

                        return delay.promise;
                        function activate () {
                            $http.get('http://api.yourkiez.de/categories.json').then(successCallback, errorCallback);
                            function successCallback (responseSuccess) {
                                delay.resolve(responseSuccess.data);
                            }
                            function errorCallback (responseError) {
                                delay.resolve(responseError.data);
                            }
                        }

                    }],
                    _ratings: ['$http', '$q', function ($http, $q) {
                        var delay = $q.defer();
                        activate();
                        return delay.promise;
                        function activate () {
                            $http.get('http://api.yourkiez.de/ratings.json').then(successCallback, errorCallback);
                            function successCallback (responseSuccess) {
                                delay.resolve(responseSuccess.data);
                            }
                            function errorCallback (responseError) {
                                delay.resolve(responseError.data);
                            }
                        }

                    }]

                }*/
            })
            .when('/hilfe', {
                templateUrl: 'partials/hilfe.html',
                controller: 'hilfeController',
                controllerAs: 'hi'
            })
            .when('/projekt', {
                templateUrl: 'partials/projekt.html',
                controller: 'projektController',
                controllerAs: 'pr'
            })
            .when('/termine', {
                templateUrl: 'partials/termine.html',
                controller: 'termineController',
                controllerAs: 'te'
            }).
            when('/nutzungsbedingungen', {
                templateUrl: 'partials/nutzungsbedingungen.html',
                controller: 'nutzungsbedingungenController',
                controllerAs: 'nu'
            }).
            when('/kommentare', {
                templateUrl: 'partials/kommentare.html',
                controller: 'kommentareController',
                controllerAs: 'ko'
            }).
            when('/impressum', {
                templateUrl: 'partials/impressum.html',
                controller: 'impressumController',
                controllerAs: 'im'
            }).
            otherwise({
                redirectTo: '/karte'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
