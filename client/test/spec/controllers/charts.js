'use strict';

describe('Controller: ChartsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ChartsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChartsCtrl = $controller('ChartsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChartsCtrl.awesomeThings.length).toBe(3);
  });
});
