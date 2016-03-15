'use strict';

/* Directives */
angular.module('richardPlatzDirectives', [])
    .directive('directUpdate', function () {

        return {
            restrict: 'E',
            priority: 500,
            scope: {
                tools: '=directUpdate'
            },

            controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
                var vm = this;
                console.log(this);
            }]

        };

})
