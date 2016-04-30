'use strict';

/* Directives */
var richardPlatzDirectives = angular.module('richardPlatzDirectives', [])
richardPlatzDirectives
    .directive('dropzone', function() {
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {

                var config = {
                    url: 'http://api.yourkiez.de/images/add',
                    maxFilesize: 100,
                    paramName: "uploadfile",
                    maxThumbnailFilesize: 10,
                    parallelUploads: 1,
                    autoProcessQueue: false
                };

                var eventHandlers = {
                    'addedfile': function(file) {
                        scope.file = file;
                        if (this.files[1]!=null) {
                            this.removeFile(this.files[0]);
                        }
                        scope.$apply(function() {
                            scope.fileAdded = true;
                        });
                    },

                    'success': function (file, response) {
                        console.log(response);
                        scope.postPicture(response);

                    }

                };

                var dropzone = new Dropzone(element[0], config);

                angular.forEach(eventHandlers, function(handler, event) {
                    dropzone.on(event, handler);
                });

                scope.processDropzone = function() {
                    dropzone.processQueue();
                };

                scope.resetDropzone = function() {
                    dropzone.removeAllFiles();
                    scope.fileAdded = false;
                    scope.file = undefined;
                }
            }
        }
    });
