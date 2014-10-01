'use strict';

angular.module('trafikklysApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.awesomeThings = [];

    $http.get('/api/lights').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };

    $scope.addLight = function() {
      if($scope.name === '') {
        return;
      }
      $http.post('/api/lights', { 
        name: $scope.name,
        info: $scope.description, 
      }).success(function (data) {
        $('.alert').fadeIn();
        $timeout(function() {          
          $scope.name = '';
          $scope.description = '';
          $('.alert').fadeOut();
        }, 3000);
      });
    };

  });
