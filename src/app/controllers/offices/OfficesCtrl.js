/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('OfficesCtrl', function ($scope, OfficeModel, callServer, loader, errorService, ModalService) {
    'use strict';

    var ctrl = this;

    $scope.$on('$saved-office', function (event, office, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === office.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, office);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, office);
      }
      office.$isSelected = true;
    });

    ctrl.callServer = _.partial(callServer, {ctrl: ctrl, Resource: OfficeModel, qf: 'name'});
    ctrl.on = {
      newOptsClick: function () {
        //console.log($scope);
        ModalService.showModal({
          templateUrl: '/views/offices/officeDlg.html',
          controller: 'ModalOfficeCtrl as ModalOffice',
          inputs: {
            office: new OfficeModel()
          }
        });
      },
      editOptsClick: function (row) {
        var
          office = OfficeModel.get({id: row.id});
        loader.invasiveVisible();
        office.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/offices/officeDlg.html',
            controller: 'ModalOfficeCtrl as ModalOffice',
            inputs: {
              office: office
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
      deleteOptsClick: function (row) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete office?',
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
                row.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).catch(function (resp) {
                  if ((resp.status === 400) && _.isObject(resp.data) && resp.data.code === 'CONSTRAINT_ERROR') {
                    resp.data.message = 'Office cannot be deleted because it has employees assigned';
                    errorService.showError(resp);
                  }

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
