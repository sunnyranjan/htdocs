'use strict';

/* Directives */
var richardPlatzDirectives = angular.module('richardPlatzDirectives', [])
richardPlatzDirectives
    .directive('directUpdate', function () {
        console.log("erewre")
        return {
            restrict: 'E',
            priority: 500,
            scope: {
                tools: '=directUpdate'
            },

            controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
                var vm = this;
                console.log("oshfoiwrfwo");
            }]

        };

})
