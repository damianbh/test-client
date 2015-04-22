/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalOfficeCtrl', function ($scope, $rootScope, office, loader, errorService, close) {
    'use strict';

    var
      self = this;

    self.model = office;

    self.title = (office.id ? 'Edit Office' : 'New Office');


    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = office.id;
        if (self.saving || !valid) {
          return;
        }

        self.saving = true;
        loader.invasiveVisible();
        return office.$save().then(function () {
          $rootScope.$broadcast('$saved-office', office, isEdit);
          close('saved');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.officeForm);
        }).finally(function () {
          loader.invasiveInvisible();
          self.saving = false;
        });
      }
    };


  });
