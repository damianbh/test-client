/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalEmployeeCtrl', function ($scope, $rootScope, employee, OfficeModel, loader, currentForm, close) {
    'use strict';

    var
      self = this;

    self.model = employee;

    self.title = (employee.id ? 'Edit Employee' : 'New Employee');


    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = employee.id;
        if (self.saving || !valid) {
          return;
        }
        self.saving = true;
        loader.invasiveVisible();
        currentForm.setFrm($scope.employeeForm);
        return employee.$save().then(function () {
          $rootScope.$broadcast('$saved-employee', employee, isEdit);
          close('saved');
        }).finally(function () {
          self.saving = false;
          loader.invasiveInvisible();
        });
      },
      refreshOffices: function (search) {
        var
          params = {
            q: search,
            sort: 'name',
            qf: 'name'
          };

        $scope.offices = OfficeModel.query(params);
        return $scope.offices.$promise;
      }
    };


  });
