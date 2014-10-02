'use strict';

angular.module('trafikklysApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, $compile) {

    $scope.markersArray = [],
    $scope.lat = false,
    $scope.lon = false;

    function placeMarker(location) {
        // first remove all markers if there are any
        deleteOverlays();

        var marker = new google.maps.Marker({
            position: location, 
            map: $scope.googleMap
        });

        // add marker in markers array
        $scope.markersArray.push(marker);

        //map.setCenter(location);
    }

    // Deletes all markers in the array by removing references to them
    function deleteOverlays() {
        if ($scope.markersArray) {
            for (var i in $scope.markersArray) {
                $scope.markersArray[i].setMap(null);
            }
        $scope.markersArray.length = 0;
        }
    }

    function bindWindow(marker, index) {
        var contentString = '<div class="bodyContent">'+ $scope.loadedLights[index].info +'</div>' + 
                            '<br/><p>Sendt inn av <strong>'+ $scope.loadedLights[index].name +'</strong></p>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });      

        google.maps.event.addListener(marker, 'click', function() {          
          infowindow.open($scope.googleMap, marker);
        });
    }

    function loadMarkers() {
       $http.get('/api/lights').success(function(lights) {
          $scope.loadedLights = lights; 
          for (var i = 0; i < lights.length; i++) {  

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.loadedLights[i].lat, $scope.loadedLights[i].lon),
              map: $scope.googleMap,
              title: $scope.loadedLights[i].name
            }); 

            bindWindow(marker, i);  

          };
        });
    }

    $scope.map = {
        center: {
            latitude: 66.313968,
            longitude: 14.143264
        },
        zoom: 12,
          events: {
            tilesloaded: function (map) {
              $scope.$apply(function () {
                // console.log(map);
                // add a click event handler to the map object
                $scope.googleMap = map;
                google.maps.event.addListener($scope.googleMap, "click", function(event)
                {
                    // place a marker
                    placeMarker(event.latLng);

                    // display the lat/lng in your form's lat/lng fields
                    $scope.lat = event.latLng.lat();
                    $scope.lon = event.latLng.lng();
                });
                loadMarkers();
              });
          }
        }
    };

    $scope.addLight = function() {
      if(!$scope.name || !$scope.description || !$scope.lat || !$scope.lon) {
        $('.alert-danger').fadeIn();
        $timeout(function() {      
          $('.alert-danger').fadeOut();
        }, 3000);
        return;
      }
      $http.post('/api/lights', { 
        name: $scope.name,
        info: $scope.description, 
        lat: $scope.lat,
        lon: $scope.lon
      }).success(function (data) {
        $('.alert-success').fadeIn();
        $timeout(function() {          
          $scope.name = '';
          $scope.description = '';
          $('.alert-success').fadeOut();
        }, 3000);
        loadMarkers();
      });
    };

  });
