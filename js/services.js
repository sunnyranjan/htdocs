'use strict';

/* Services */

var richardplatzServices = angular.module('richardplatzServices', ['ngResource']);

richardplatzServices.factory('$userComment', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);
