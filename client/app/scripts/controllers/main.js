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
      var hostname = "localhost";
      var featureLayer, featureGroup, heat;
      var currentFilter = 'tripShape';
      var prevDate = '4/1/2014 12:00 PM';
      var currDate = '4/1/2014 12:05 PM';
      var loader = document.getElementById('load');
      var requestObj;

      /*** Filter widgets ***/
      $('#datetimepickerFromDate').datetimepicker({
        defaultDate: prevDate
      });
      $('#datetimepickerToDate').datetimepicker({
        defaultDate: currDate
      });

      $(".dropdown-menu").on("click", "li", function(event){
        //featureLayer.clearLayers();
        if(event.target.title === 'tripShape' || event.target.title === 'clusterPickup' || event.target.title === 'heat'){
          if(featureLayer != null) {
            featureLayer.clearLayers();
          }
          if(markers != null) {
            markers.clearLayers();
          }
          currentFilter = event.target.title;
          if(currentFilter === 'tripShape' && requestObj != null) {
            startLoading();
            plotFilteredTrips(requestObj);
          }else if(currentFilter === 'clusterPickup' && requestObj != null) {
            $('#tripPanel').text('');
            startLoading();
            fetchTopPickups(requestObj);
          }else if(currentFilter === 'heat' && requestObj != null) {
            $('#tripPanel').text('');
            startLoading();
            fetchHeatMap(requestObj);
          }
        }else {
          if(featureGroup != null) {
            featureGroup.clearLayers();
          }
          if(markers != null) {
            markers.clearLayers();
          }
          if(event.target.title === 'trip') {
            fetchTripCount(null);
          }else{
            $('#tripPanel').text('');
          }
          featureLayer.loadURL('http://' + hostname + ':8080/v1/draw/' + event.target.title + "?" + getDateQueryParam()).addTo(map);

        }
      });

      $("#clearBtn").on("click", function(){
        if(featureGroup != null) {
          featureGroup.clearLayers();
        }
        if(featureLayer != null) {
          featureLayer.clearLayers();
        }
        if(markers != null) {
          markers.clearLayers();
        }
        requestObj = null;
        /*if(heat != null){
          //heat._heatmap.setData([[]])
          heat._heat._data = [];
        }*/
        map.eachLayer(function (layer) {
          console.log(layer);
          if(layer._heat != null)
            map.removeLayer(layer);
        });
        $('#tripPanel').text('');
      });

      function getDateQueryParam(){
        var startDate = $('#datetimepickerFromDate').data('date');
        var endDate = $('#datetimepickerToDate').data('date');
        var sDate = new Date(startDate);
        var eDate = new Date(endDate);
        return "startDate=" + sDate.getTime() + "&endDate=" + eDate.getTime();
      }

      /** AJAX Requests **/
      // Fetch top-pickup
      function fetchTopPickups(json) {
        $.ajax({
          'url' : 'http://' + hostname + ':8080/v1/draw/clusterPickups?polygon=' + json + "&" + getDateQueryParam(),
          'type' : 'GET',
          'success' : function(data) {
            plotTopPickups(data);
          },
          'error': function (xhr, status, errorThrown) {
            $('#login-error').text('Error Code: ' +  xhr.status + ' Message:' + xhr.responseText);
            finishedLoading();
            $('#login-error').show();
          }
        });
      }

    // Fetch pickup/drop-off cluster
    function fetchHeatMap(json) {
      $.ajax({
        'url' : 'http://' + hostname + ':8080/v1/draw/clusterTrips?polygon=' + json + "&" + getDateQueryParam(),
        'type' : 'GET',
        'success' : function(data) {
          heat = L.heatLayer(data, {maxZoom: 18}).addTo(map);
          finishedLoading();
        },
        'error': function (xhr, status, errorThrown) {
          alert('Error Code: ' +  xhr.status + ' Message:' + xhr.responseText);
          finishedLoading();
        }
      });
    }

    // Fetch top-pickup
    function fetchTripCount(json) {
        var url;
        if(json == null){
          url = 'http://' + hostname + ':8080/v1/stats/tripCount?' + getDateQueryParam();
        }else{
          url = 'http://' + hostname + ':8080/v1/stats/tripCount?polygon=' + json + "&" + getDateQueryParam();
        }
        $.ajax({
          'url' : url,
          'type' : 'GET',
          'success' : function(data) {
            $('#tripPanel').text(data);
          },
          'error': function (xhr, status, errorThrown) {
            $('#login-error').text('Error Code: ' +  xhr.status + ' Message:' + xhr.responseText);
            finishedLoading();
            $('#login-error').show();
          }
        });
    }

    /** Handling loader/error logic **/
      function startLoading() {
        loader.className = 'show';
      }

      function finishedLoading() {
        setTimeout(function() {
          loader.className = 'hide';
        }, 500);
      }

      $('.alert .close').on('click', function(e) {
        $(this).parent().hide();
      });

      /*** Map component ***/
      L.mapbox.accessToken = 'pk.eyJ1Ijoia2tkb29uIiwiYSI6ImNpdWMwanltYjAwNmIyeXAyejBxYjlkY2QifQ.kdMjB6xkE-W-P4ff4y0ujg';

      // Setting up map
      var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([40.77, -73.88], 11);
      featureGroup = L.featureGroup().addTo(map);
      featureLayer = L.mapbox.featureLayer()
        .loadURL('http://' + hostname + ':8080/v1/draw/trip?' + getDateQueryParam())
        .addTo(map);

      fetchTripCount(null);

      // Enabling clustering
      var markers = new L.MarkerClusterGroup();

      // Initializing drawing component
      var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: featureGroup
        },
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false
        }
      }).addTo(map);

      map.on('draw:created', showPolygonArea);
      map.on('draw:edited', showPolygonAreaEdited);

      function showPolygonAreaEdited(e) {
        e.layers.eachLayer(function(layer) {
          showPolygonArea({ layer: layer });
        });
      }

      function showPolygonArea(e) {
        //featureGroup.clearLayers();
        if(featureLayer != null) {
          featureLayer.clearLayers();
        }
        featureGroup.addLayer(e.layer);
        e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
        e.layer.openPopup();
        requestObj = getPolygonJsonArray(e.layer._latlngs);
        startLoading();
        if(currentFilter === 'tripShape') {
          plotFilteredTrips(requestObj);
        }else if(currentFilter === 'clusterPickup') {
          $('#tripPanel').text('');
          fetchTopPickups(requestObj);
        }else if(currentFilter === 'heat') {
          $('#tripPanel').text('');
          fetchHeatMap(requestObj);
        }
      }

      // Creating json array for sending polygon-based filter query to back-end
      function getPolygonJsonArray(latlongArray){
        var resultJson = [];
        for(var obj in latlongArray)
        {
          var json = [];
          json.push(latlongArray[obj].lng);
          json.push(latlongArray[obj].lat);
          resultJson.push(json);
        }

        if(resultJson.length > 0){
          var json = [];
          json.push(resultJson[0][0]);
          json.push(resultJson[0][1]);
          resultJson.push(json);
        }
        return resultJson;
      }

      // Plotting filtered trips based on user-drawn polygon
      function plotFilteredTrips(json){
        $('#login-error').hide();
        /*if(featureLayer != null){
          featureLayer.clearLayers();
        }*/
        fetchTripCount(json);
        featureLayer = L.mapbox.featureLayer()
          .loadURL('http://' + hostname + ':8080/v1/draw/trip?polygon=' + json + "&" + getDateQueryParam())
          .addTo(map)
          .on('ready', finishedLoading)
          .on('error', function(error) {
            if(error != null && error.error.responseText.indexOf('canonicalize query') != -1){
              $('#login-error').text('Following shape not permitted! Please provide non-overlapping shape.');
            }else{
              $('#login-error').text('Server Error: ' + error.error.responseText);
            }
            finishedLoading();
            $('#login-error').show();
          });
      }

      // Plotting top pick-up places using clustering
      function plotTopPickups(json){
        try {
          $('#login-error').hide();
          //markers.clearLayers();
          for (var i = 0; i < json.length; i++) {
            var a = json[i];
            var title = a[2];
            var marker = L.marker(new L.LatLng(a[0], a[1]), {
              icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
              title: title
            });
            marker.bindPopup(title);
            markers.addLayer(marker);
          }
          map.addLayer(markers);
        }catch(err){
          $('#login-error').show();
          console.log(err);
        }finally {
          finishedLoading();
        }
      }
  });
