'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ChartsCtrl
 * @description
 * # ChartsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ChartsCtrl', function ($scope) {
    var hostname = 'localhost';
  $.getJSON('http://' + hostname + ':8080/v1/stats/tripFrequency', function (data) {

    $('#chart-container').highcharts({
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Timeseries Monthly Curve (No. Of Trips)'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: '# of Trips'
        },
        type: 'number'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: 'Trips',
        data: data
      }]
    });
  });

  /** Chart 2: Top Speed, Max. Distance, No of Trips **/
  $.ajax({
    'url' : 'http://' + hostname + ':8080/v1/stats/tripCount',
    'type' : 'GET',
    'success' : function(data) {
      $('#totalTripStat').text(data);
    },
    'error': function (xhr, status, errorThrown) {
      console.log('Error Code: ' +  xhr.status + ' Message:' + xhr.responseText);
    }
  });
});
