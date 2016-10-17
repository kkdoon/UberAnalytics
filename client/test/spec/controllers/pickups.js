'use strict';

describe('Controller: PickupsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PickupsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PickupsCtrl = $controller('PickupsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PickupsCtrl.awesomeThings.length).toBe(3);
  });
});
