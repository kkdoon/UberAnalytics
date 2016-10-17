'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngRoute',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    // Set the base URL for Restangular.
    RestangularProvider.setBaseUrl('http://localhost:8080/v1');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/trips', {
        templateUrl: 'views/trips.html',
        controller: 'TripsCtrl'
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'stats'
      })
      .when('/pickups', {
        templateUrl: 'views/pickups.html',
        controller: 'PickupsCtrl'
      })
      .when('/heat', {
        templateUrl: 'views/heat.html',
        controller: 'HeatCtrl',
        controllerAs: 'heat'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('TripsRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setRestangularFields({
            id: '_id'
          });
        });
  })
  .factory('Trips', function(TripsRestangular) {
        return TripsRestangular.service('trips');
  });
