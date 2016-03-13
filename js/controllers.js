'use strict';
/* Controllers */

var richardplatzControllers = angular.module('richardplatzControllers', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

richardplatzControllers.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $element) {

    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildDelayedToggler(navID) {
        return debounce(function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {

                });
        }, 200);
    }


    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {

                });
        }
    }
})
    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    })
    .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    });



richardplatzControllers.controller('homeController', ['$scope', '$userComment', '$window','$http', '_categories',
    function ($scope, $userComment, $window,$http, _categories) {
        var vm = this;

        //enable caching for better user performance
        $.ajaxSetup({
            cache: true
        });


        //first and foremost thing should be to load the google maps and infobox
        $.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDGUoGibBjOs0LpwHxkgTsnGJAF-u8Z80A&region=DE', mapsAPIReady);

        function mapsAPIReady() {
            $.getScript('js/infobox.js', initMap);

        }

        $scope.theme = 'lime';
        $http.get('http://api.yourkiez.de/comments.json').then(successCallback, errorCallback);
        function successCallback (response){
            console.log(response);
        }
        function errorCallback(response) {
            console.log(response);
        }

        var map;
        var marker;
        var markerIcon = {} ;
        var properties = ["none","education", "home", "infrastructure", "neighbour", "shop", "tree", "sport"];
        vm.svg = {}, vm.icon = {}, vm.options = {};
        vm.options.ages = ["keine Angabe","1-12","12-18","18-65", "Über 65"];
        vm.options.sexes = ["keine Angabe", "Mann", "Frau"];

        //for shooping (shoping cart)
        vm.svg.shop = "M16,0.094C7.215,0.094,0.094,7.216,0.094,16c0,8.783,7.121,15.906,15.906,15.906S31.906,24.783,31.906,16 " +
            "C31.906,7.216,24.785,0.094,16,0.094z M25.541,17.16c-0.27,0.726-0.971,1.211-1.744,1.211H12.049l0.303,1.293h11.096 " +
            "c0.646,0,1.169,0.523,1.169,1.17c0,0.646-0.522,1.169-1.169,1.169h-1.09c0.598,0.438,0.99,1.139,0.99,1.937 " +
            "c0,1.327-1.078,2.404-2.405,2.404s-2.403-1.077-2.403-2.404c0-0.798,0.393-1.498,0.99-1.937h-4.484 " +
            "c0.596,0.438,0.989,1.139,0.989,1.937c0,1.327-1.075,2.404-2.403,2.404s-2.404-1.077-2.404-2.404c0-0.801,0.395-1.505,0.996-1.941 " +
            "c-1.023-0.027-1.896-0.729-2.131-1.732l-2.6-11.084H5.414c-0.646,0-1.17-0.523-1.17-1.169s0.523-1.17,1.17-1.17h2.146 " +
            "c1.052,0,1.953,0.714,2.193,1.737l1.928,8.233h12.115c0.125,0,0.238-0.078,0.282-0.197l2.16-5.814 " +
            "c0.034-0.092,0.021-0.196-0.035-0.276c-0.057-0.082-0.149-0.13-0.247-0.13H14.43c-0.432,0-0.779-0.349-0.779-0.779 " +
            "c0-0.431,0.349-0.78,0.779-0.78h11.527c0.609,0,1.182,0.299,1.528,0.8c0.347,0.499,0.428,1.138,0.216,1.709L25.541,17.16z";

        //for home (home)
        vm.svg.home = "M16.094,0.125c-8.785,0-15.906,7.122-15.906,15.906c0,8.783,7.122,15.906,15.906,15.906" +
            "C24.878,31.938,32,24.814,32,16.031C32,7.247,24.878,0.125,16.094,0.125z M24,15.733v8.875h-5.375v-6.625L13.5,18.007v6.601H7.75" +
            "V15.67H4.875L16.219,4.576l11.156,11.156L24,15.733L24,15.733z";


        //for infrastructure (car)
        vm.svg.infrastructure = "M16,0.187c-8.785,0-15.906,7.122-15.906,15.906C0.094,24.879,7.216,32,16,32" +
            "c8.785,0,15.906-7.121,15.906-15.907C31.906,7.309,24.785,0.187,16,0.187z M27.766,19.939c-0.008,0.055-0.014,0.109-0.023,0.16" +
            "c-0.244,1.342-1.414,2.359-2.826,2.359c-1.35,0-2.48-0.932-2.791-2.186c-0.01-0.037-0.015-0.074-0.021-0.113" +
            "c-3.316,0.082-7.535,0.178-10.928,0.25c-0.024,0.092-0.054,0.178-0.086,0.262c-0.438,1.139-1.539,1.945-2.831,1.945" +
            "c-1.248,0-2.317-0.754-2.785-1.826c-0.036-0.084-0.068-0.17-0.097-0.258c-0.075,0.002-0.122,0.002-0.13,0.002" +
            "c0.011,0-0.266,0.037-0.633,0.037c-1.153,0-1.839-0.35-1.983-1.012l-0.005-0.045v-2.492l0.046-0.059" +
            "c0,0.002,0.099-0.145,0.142-0.497c0.055-0.442,0.396-0.818,0.608-0.978c0.095-0.326,0.601-1.169,3.248-1.689" +
            "c1.866-0.367,2.476-0.59,2.669-0.684l0.109-0.102c0.153-0.143,3.853-3.54,8.558-3.446c3.232,0.069,5.389,0.513,6.547,0.75" +
            "c0.451,0.093,0.775,0.159,0.937,0.159c0.078-0.007,0.112-0.009,0.146-0.009c0.226,0,0.355,0.101,0.424,0.185" +
            "c0.148,0.182,0.154,0.444,0.123,0.659c0.084,0.083,0.283,0.244,0.445,0.376c0.672,0.544,1.195,0.988,1.318,1.344" +
            "c0.02,0.053,0.033,0.064,0.033,0.064c0.043,0,0.07-0.003,0.096-0.008c0.043-0.004,0.086-0.008,0.127-0.008" +
            "c0.426,0,0.551,0.412,0.609,0.722c0.08,0.442,0.123,0.954,0.162,1.407c0.041,0.51,0.086,1.088,0.182,1.235" +
            "c0.174,0.273,0.422,1.562-0.064,2.513C28.822,19.486,28.364,19.813,27.766,19.939z";


        //for neighbour (lot of people signs)
        vm.svg.neighbour = "M15.969,0.125c-8.785,0-15.906,7.122-15.906,15.906c0,8.783,7.122,15.906,15.906,15.906" +
            "c8.785,0,15.906-7.123,15.906-15.906C31.875,7.247,24.754,0.125,15.969,0.125z M26.238,10.68c0.787,0,1.426,0.639,1.426,1.424" +
            "c0,0.786-0.639,1.424-1.426,1.424c-0.786,0-1.424-0.638-1.424-1.424S25.452,10.68,26.238,10.68z M22.001,8.089" +
            "c1.169,0,2.122,0.952,2.122,2.121c0,1.168-0.953,2.117-2.122,2.117s-2.118-0.948-2.118-2.117C19.883,9.04,20.832,8.089,22.001,8.089" +
            "z M15.999,3.854c1.728,0,3.138,1.406,3.135,3.134c0,1.727-1.407,3.135-3.135,3.135c-1.728,0-3.133-1.408-3.133-3.135" +
            "C12.865,5.26,14.271,3.854,15.999,3.854z M10,8.089c1.167,0,2.117,0.952,2.117,2.121c0,1.168-0.951,2.117-2.117,2.117" +
            "c-1.17,0-2.122-0.948-2.122-2.117C7.878,9.04,8.83,8.089,10,8.089z M5.763,10.68c0.786,0,1.425,0.639,1.425,1.424" +
            "c0,0.786-0.639,1.424-1.425,1.424c-0.787,0-1.426-0.638-1.426-1.424S4.976,10.68,5.763,10.68z M5.837,16.535v4.445H3.421V16.68" +
            "c0-1.292,1.052-2.343,2.342-2.343c0.23,0,0.446,0.044,0.659,0.106C6.058,15.062,5.837,15.771,5.837,16.535z M10.308,15.871v6.763" +
            "H6.613v-6.099c0-1.868,1.519-3.388,3.389-3.388c0.333,0,0.648,0.064,0.95,0.153C10.555,14.075,10.308,14.94,10.308,15.871z" +
            "M20.913,24.591h-9.829V15.87c0-2.71,2.202-4.915,4.915-4.915c2.709,0,4.915,2.205,4.915,4.915L20.913,24.591L20.913,24.591z" +
            "M25.389,22.634h-3.699v-6.763c0-0.93-0.246-1.795-0.643-2.571c0.303-0.089,0.62-0.153,0.953-0.153c1.866,0,3.389,1.519,3.389,3.388" +
            "V22.634L25.389,22.634z M26.164,20.979v-4.444c0-0.764-0.225-1.473-0.583-2.091c0.21-0.062,0.431-0.106,0.657-0.106" +
            "c1.289,0,2.341,1.052,2.341,2.343v4.299H26.164z";


        //for sports (dumbbell)
        vm.svg.sport = "M16.08,0C7.295,0,0.174,7.122,0.174,15.906c0,8.783,7.121,15.904,15.906,15.904s15.906-7.121,15.906-15.904 " +
            "C31.986,7.122,24.865,0,16.08,0z M30.578,18.772h-1.104v1.643c0,0.573-0.468,1.039-1.04,1.039h-1.072 " +
            "c-0.012,0-0.022-0.002-0.034-0.002v0.036c0,0.571-0.465,1.038-1.038,1.038h-1.072c-0.573,0-1.039-0.467-1.039-1.038v-2.746H8.026 " +
            "v2.746c0,0.571-0.466,1.038-1.039,1.038H5.915c-0.573,0-1.039-0.467-1.039-1.038v-0.036c-0.011,0-0.022,0.002-0.033,0.002H3.77 " +
            "c-0.572,0-1.039-0.466-1.039-1.039v-1.643H1.625c-0.572,0-1.039-0.465-1.039-1.039v-3.468c0-0.573,0.466-1.038,1.039-1.038h1.106 " +
            "v-1.643c0-0.572,0.466-1.039,1.039-1.039h1.073c0.011,0,0.022,0.002,0.033,0.002v-0.035c0-0.572,0.466-1.039,1.039-1.039h1.073 " +
            "c0.572,0,1.039,0.467,1.039,1.039v2.792h16.151v-2.792c0-0.572,0.466-1.039,1.039-1.039h1.072c0.573,0,1.038,0.467,1.038,1.039 " +
            "v0.035c0.012,0,0.022-0.002,0.034-0.002h1.072c0.572,0,1.04,0.467,1.04,1.039v1.643h1.104c0.573,0,1.039,0.465,1.039,1.038v3.468 " +
            "C31.617,18.308,31.151,18.772,30.578,18.772z";

        //for education (graduation hat)
        vm.svg.education = "M16,0.094C7.215,0.094,0.094,7.215,0.094,16S7.215,31.906,16,31.906c8.785,0,15.906-7.121,15.906-15.906 " +
            "S24.785,0.094,16,0.094z M26.286,13.966v7.962l0.636,1.94l-0.961,1.286h-0.326l-0.963-1.286l0.639-1.94v-7.492L23.3,15.404v4.603 " +
            "c-0.007,0.017-0.013,0.032-0.021,0.048l-7.421,3.573h-1.249l-7.441-3.584v-4.64l-4.276-2.061V12.79l12.342-5.946l12.353,5.951v0.544 L26.286,13.966z";

        //for public spaces (tree)
        vm.svg.tree = "M16.001,0.094C7.216,0.094,0.095,7.216,0.095,16c0,8.785,7.122,15.906,15.906,15.906S31.906,24.785,31.906,16 " +
            "C31.906,7.216,24.785,0.094,16.001,0.094z M13.314,28.616c0.288-1.227,0.696-2.742,0.771-4.104 " +
            "c0.039-0.716-0.143-3.534-0.143-3.534c-0.489,0.126-1.5-0.508-2.205-1.015c-0.509,0.264-1.086,0.415-1.699,0.415 " +
            "c-2.045,0-3.704-1.659-3.704-3.704c0-0.066,0.006-0.134,0.01-0.2c-0.841-0.679-1.38-1.717-1.38-2.882 " +
            "c0-1.318,0.69-2.473,1.728-3.128c-0.008-0.099-0.015-0.196-0.015-0.296c0-2.047,1.659-3.704,3.704-3.704 " +
            "c0.155,0,0.308,0.013,0.458,0.03c0.283-1.764,1.808-3.113,3.652-3.113c1.391,0,2.601,0.768,3.234,1.9 " +
            "c0.557-0.334,1.207-0.53,1.904-0.53c1.593,0,2.947,1.007,3.47,2.418c1.864,0.192,3.316,1.769,3.316,3.683 " +
            "c0,0.465-0.089,0.908-0.246,1.318c0.577,0.654,0.931,1.509,0.931,2.449c0,1.594-1.007,2.951-2.418,3.474 " +
            "c-0.193,1.864-1.77,3.321-3.683,3.321c-0.775,0-1.493-0.231-2.087-0.639l-1.545,1.599c0,0-0.314,1.682-0.286,2.595 s0.687,3.648,0.687,3.648h-4.454V28.616z";

        vm.contentNode = $('#infoWindowContent')[0];

        angular.forEach(properties, function (v,k) {
            markerIcon[v]= {};
        });

        $scope.category ="none";
        $scope.comments = "";
        $scope.userAge = "";
        $scope.userSex = "";
        $scope.categoryChange= function (category){
            $scope.category = category;
        };
        $scope.colorChange =  function (color, rating) {
            if(angular.isDefined(marker)) {

            }
            vm.step1 = false ;
            vm.step2 = false ;
            vm.step3 = true ;

            $scope.color = color;
            $scope.rating = rating;

        };


        $scope.formSubmit = function () {


            var saveUserComment = {};
            saveUserComment.latitude = $scope.latitude;
            saveUserComment.longitude =  $scope.longitude;
            saveUserComment.category =$scope.category;
            saveUserComment.color = $scope.color;
            saveUserComment.rating = $scope.rating;
            saveUserComment.comments = $scope.comments;
            saveUserComment.userAge = $scope.userAge;
            saveUserComment.userSex = $scope.userSex;
            console.log(saveUserComment);
            vm.infobox.close();
            marker.setMap(null);

            var content = '<div class="container-fluid" style="background-color:'+ $scope.color+ ' ">'+
                        '<div class="col-sm-12"> '+
                        '<h4>'+ saveUserComment.comments + '</h4></div></div>'

            var latlng =  new google.maps.LatLng($scope.latitude, $scope.longitude);
            var saveicon = angular.copy(vm.icon[saveUserComment.category]);
            saveicon.fillColor = saveUserComment.color;

            var savedMarker = new google.maps.Marker({
                icon: saveicon,
                position: latlng,
                map: map,
                draggable: false,
                clickable: true
            });

            var infoboxToMarker = new google.maps.infobox ;
            infoboxToMarker.set('isCustominfobox', true);

            savedMarker.addListener('click', function(event) {console.log(this)

                //infoboxToMarker.setPosition(event.latLng);
                // open the info window
                infoboxToMarker.setContent(content)
                infoboxToMarker.open(map, savedMarker);

            });
            reinitialize();


        }


        function reinitialize(){
            $scope.latitude= "";
            $scope.longitude= "";
            $scope.category= "";
             $scope.color= "";
             $scope.rating= "";
             $scope.comments= "";
             $scope.userAge= "";
            $scope.userSex= "";

        }



        function initMap() {

            //first and foremost initialize the map
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 52.472489, lng: 13.448529},
                zoom: 17,
                minZoom: 16,
                //styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}],
                streetViewControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: [
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.HYBRID
                    ],
                    style: google.maps.MapTypeControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.BOTTOM_LEFT
                },
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                }
            });
            vm.step1 = true;
            vm.step2=false;
            vm.step3= false;
            $scope.jumpNext = function () {
                vm.step1 = false ;
                vm.step2 = true ;
                vm.step3 = false ;

            };

            // initialize a round symbol marker
            vm.svg.none = google.maps.SymbolPath.CIRCLE;


            //initialise all the icons
            angular.forEach(properties, function (v, k) {
                switch (v) {
                    case "none":
                        vm.icon[v] = {
                            path: vm.svg[v],
                            fillColor: 'grey',
                            fillOpacity: 0.9,
                            scale: 14,
                            strokeWeight: 0,
                            anchor: new google.maps.Point(0, 0)
                        }
                        break;
                    default:
                        vm.icon[v]= {
                            path: vm.svg[v],
                            fillColor: 'grey',
                            fillOpacity: 0.9,
                            scale: 1,
                            strokeWeight: 0,
                            anchor: new google.maps.Point(16, 16)
                        }
                        break;

                }

            });


            //initialize the infobox
            vm.infobox;

            //set the flag that it is a custom info window
            //vm.infobox.set('isCustominfobox', true);
            // disable all non custom info windows
            //disablePOIinfobox();

            //add a click event to the map to initialize the marker and infobox
            map.addListener('click', function (event) {


                vm.step1 = true;
                vm.step2=false;
                vm.step3= false;
                //in jquery u must scope apply
                $scope.$apply();
                placeMarker(event.latLng, map);
            });





            // finish infobox related stuff

            //start marker related stuff




            $scope.$watch('category', function(n, o) {
                if(angular.isDefined(marker))
                marker.setIcon(vm.icon[n]);

            });




            function placeMarker(latLng, map) {
                $scope.category= "none";
                $scope.latitude = latLng.lat();
                $scope.longitude = latLng.lng();

                if (marker)
                    marker.setMap(null);
                marker = new google.maps.Marker({
                    icon: vm.icon.none,
                    position: latLng,
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });



                var myOptions = {
                    content: vm.contentNode,
                    alignBottom: true,
                    zIndex: 99999,
                    pixelOffset: new google.maps.Size(-300, 0),
                    closeBoxMargin: "0px"



                };

                var windowWidth = $(window).width();
                if(angular.isDefined(vm.infobox)) {
                    vm.infobox.setMap(null);
                }
                vm.infobox = new InfoBox(myOptions);
                if(windowWidth > 0 && windowWidth < 600) {
                    vm.infobox.setOptions({'pixelOffset': new google.maps.Size(-windowWidth/2, -18)});
                }
                else {
                    vm.infobox.setOptions({'pixelOffset': new google.maps.Size(-300, -18)});
                }
                vm.infobox.open(map, marker);



                google.maps.event.addListener(vm.infobox,'closeclick',function(){
                    if (marker)
                        marker.setMap(null);
                });

            }


        }




    }]);

richardplatzControllers.controller('projektController', ['$scope', '$routeParams', '$userComment',
    function ($scope, $routeParams, $userComment) {
        $scope.phone = $userComment.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);

richardplatzControllers.controller('impressumController', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);

richardplatzControllers.controller('hilfeController', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);

richardplatzControllers.controller('commentsController', ['$scope', '$routeParams', 'Phone',
    function ($scope, $routeParams, Phone) {
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function (phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);
