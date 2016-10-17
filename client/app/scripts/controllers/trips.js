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
  //$scope.trips = Trips.getList({startDate: new Date(), endDate: new Date()}).$object;
    $(function () {
      var prevDate = '4/1/2014 12:00 PM';
      var currDate = '4/1/2014 12:05 PM';
      $('#datetimepickerFromDateTrip').datetimepicker({
        defaultDate: prevDate
      });
      $('#datetimepickerToDateTrip').datetimepicker({
        defaultDate: currDate
      });

      $("#fetchBtn").on("click", function(){
        var startDate = $('#datetimepickerFromDateTrip').data('date');
        var endDate = $('#datetimepickerToDateTrip').data('date');
        var sDate = new Date(startDate);
        var eDate = new Date(endDate);
        //var request = {startDate: sDate, endDate: eDate};
        $scope.trips = Trips.getList({startDate: sDate.getTime(), endDate: eDate.getTime()}).$object;
      });
    });
});
