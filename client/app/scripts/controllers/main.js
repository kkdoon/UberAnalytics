'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, Restangular) {
    $(function () {
      var prevDate = '4/1/2014 12:00 PM';
      var currDate = '4/1/2014 12:05 PM';
      $('#datetimepickerFromDate').datetimepicker({
        defaultDate: prevDate
      });
      $('#datetimepickerToDate').datetimepicker({
        defaultDate: currDate
      });
      var featureLayer;
      $(".dropdown-menu").on("click", "li", function(event){
        featureLayer.clearLayers();
        featureLayer.loadURL('http://localhost:8080/v1/draw/' + event.target.title + "?" + getDateQueryParam()).addTo(map);
      });

      L.mapbox.accessToken = 'pk.eyJ1Ijoia2tkb29uIiwiYSI6ImNpdWMwanltYjAwNmIyeXAyejBxYjlkY2QifQ.kdMjB6xkE-W-P4ff4y0ujg';

      var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([40.77, -73.88], 11);
      featureLayer = L.mapbox.featureLayer()
        .loadURL('http://localhost:8080/v1/draw/trip?' + getDateQueryParam())
        .addTo(map);

      function getDateQueryParam(){
        var startDate = $('#datetimepickerFromDate').data('date');
        var endDate = $('#datetimepickerToDate').data('date');
        var sDate = new Date(startDate);
        var eDate = new Date(endDate);
        return "startDate=" + sDate.getTime() + "&endDate=" + eDate.getTime();
      }
    });
  });
