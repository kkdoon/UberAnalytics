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
        controller: 'MainCtrl',
        controllerAs: 'main'
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
