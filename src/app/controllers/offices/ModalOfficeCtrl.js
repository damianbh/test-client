/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalOfficeCtrl', function ($scope, $rootScope, office, loader, currentForm, close) {
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
        currentForm.setFrm($scope.officeForm);
        return office.$save().then(function () {
          $rootScope.$broadcast('$saved-office', office, isEdit);
          close('saved');
        }).finally(function () {
          loader.invasiveInvisible();
          self.saving = false;
        });
      }
    };


  });
