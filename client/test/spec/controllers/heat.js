'use strict';

describe('Controller: HeatCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var HeatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeatCtrl = $controller('HeatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HeatCtrl.awesomeThings.length).toBe(3);
  });
});
