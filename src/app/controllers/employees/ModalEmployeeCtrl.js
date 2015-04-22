/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalEmployeeCtrl', function ($scope, $rootScope, employee, OfficeModel, loader, errorService, close) {
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
        return employee.$save().then(function () {
          $rootScope.$broadcast('$saved-employee', employee, isEdit);
          close('saved');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.employeeForm);
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
        return $scope.offices.$promise.catch(function (resp) {
          errorService.showError(resp);
        });
        //return $http.get(
        //  'http://maps.googleapis.com/maps/api/geocode/json',
        //  {params: params}
        //).then(function(response) {
        //    $scope.addresses = response.data.results
        //  });
      }
    };


  });
