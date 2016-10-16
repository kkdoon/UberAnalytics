'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TripsCtrl
 * @description
 * # TripsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('TripsCtrl', function ($scope, Trips) {
  $scope.trips = Trips.getList().$object;
});
