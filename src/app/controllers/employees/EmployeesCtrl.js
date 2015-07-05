/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('EmployeesCtrl', function ($scope, callServer, EmployeeModel, ModalService, $timeout, loader) {
    'use strict';

    var ctrl = this;
    $scope.$on('$saved-employee', function (event, employee, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === employee.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, employee);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, employee);
      }
      employee.$isSelected = true;
    });

    ctrl.callServer = _.partial(callServer, {ctrl: ctrl, Resource: EmployeeModel, qf: 'firstName,lastName,initials'});
    ctrl.on = {
      newOptsClick: function () {
        //console.log($scope);
        ModalService.showModal({
          templateUrl: '/views/employees/employeeDlg.html',
          controller: 'ModalEmployeeCtrl as ModalEmployee',
          inputs: {
            employee: new EmployeeModel()
          }
        });
      },
      editOptsClick: function (row) {
        var
          employee = EmployeeModel.get({id: row.id});
        loader.invasiveVisible();
        employee.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/employees/employeeDlg.html',
            controller: 'ModalEmployeeCtrl as ModalEmployee',
            inputs: {
              employee: employee
            }
          });
        })
          //  .catch(function (resp) {
          //  errorService.showError(resp);
          //})
          .finally(function () {
            loader.invasiveInvisible();
          });

      },
      deleteOptsClick: function (employee) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete employee?',
            buttons: {
              yes: {
                type: 'primary',
                text: 'Yes'
              },
              no: {
                type: 'default',
                text: 'No'
              }
            },
            message: 'Once Deleted, you will not be able to recover it.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                employee.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).finally(function () {
                    loader.invasiveInvisible();
                  });
                break;

              default:

            }
          });
        });
      }
    };
  });
