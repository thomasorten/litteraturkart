'use strict';

angular.module('litteraturkartApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, $compile) {

    $scope.markersArray = [],
    $scope.lat = false,
    $scope.lon = false;

    function placeMarker(location) {
        // first remove all markers if there are any
        deleteOverlays();

        var marker = new google.maps.Marker({
            position: location, 
            map: $scope.googleMap,
            icon: '/assets/images/place_unselected.png'
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
        var contentString = '<div class="bodyContent">'+ $scope.loadedPlaces[index].info +'</div>' + 
                            '<br/><p>Sendt inn av <strong>'+ $scope.loadedPlaces[index].name +'</strong></p>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });      

        google.maps.event.addListener(marker, 'click', function() {          
          infowindow.open($scope.googleMap, marker);
        });
    }

    function loadMarkers() {
       $http.get('/api/places').success(function(places) {
          $scope.loadedPlaces = places; 
          for (var i = 0; i < places.length; i++) {  

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.loadedPlaces[i].lat, $scope.loadedPlaces[i].lon),
              map: $scope.googleMap,
              title: $scope.loadedPlaces[i].name,
              icon: '/assets/images/place.png'
            }); 

            bindWindow(marker, i);  

          };
        });
    }
 
    $scope.coords = $(window).width() > 767 ? { lat: 59.918171, lon: 10.835288 } : { lat: 59.924462, lon: 10.747094 };

    $scope.map = {
        center: {  
            latitude: $scope.coords.lat,
            longitude: $scope.coords.lon
        },
        zoom:  $(window).width() > 991 ? 13 : 12,
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
        },
        options: {
          styles: [{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"lightness":"-50"},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"saturation":"0"},{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"labels.icon","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"off"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"lightness":"0"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"lightness":"50"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#95969a"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"lightness":"0"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"},{"lightness":"0"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#3c3c31"}]},{"featureType":"road.highway.controlled_access","elementType":"labels","stylers":[{"lightness":"0"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"lightness":"-10"},{"saturation":"0"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"41"},{"saturation":"0"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"lightness":"0"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dce6e6"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"labels.text","stylers":[{"lightness":"50"}]}]
        }
    };

    $scope.submit = function() {
      if(!$scope.name || !$scope.description || !$scope.lat || !$scope.lon) {
        $('.alert-danger').fadeIn();
        $timeout(function() {      
          $('.alert-danger').fadeOut();
        }, 3000);
        return;
      }
      $http.post('/api/places', { 
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
