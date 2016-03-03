'use strict';

/* App Module */

var richardplatzApp = angular.module('richardplatzApp', [
  'ngRoute',
  'richardplatzAnimations',

  'richardplatzControllers',
  'richardplatzFilters',
  'richardplatzServices'
]);

richardplatzApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController',
        controllerAs: 'vm'
      }).
      when('/projekt', {
        templateUrl: 'partials/projekt.html',
        controller: 'projektController'
      }).
      when('/hilfe', {
        templateUrl: 'partials/hilfe.html',
        controller: 'hilfeController'
      }).
      when('/projekt', {
        templateUrl: 'partials/comments.html',
        controller: 'commentsController'
      }).
      when('/projekt', {
        templateUrl: 'partials/comments.html',
        controller: 'commentsController'
      }).
      when('/projekt', {
        templateUrl: 'partials/impressum.html',
        controller: 'impressumController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
