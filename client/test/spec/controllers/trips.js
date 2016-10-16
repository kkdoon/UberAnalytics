'use strict';

describe('Controller: TripsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var TripsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TripsCtrl = $controller('TripsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TripsCtrl.awesomeThings.length).toBe(3);
  });
});
