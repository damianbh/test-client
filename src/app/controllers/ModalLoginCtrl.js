/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalLoginCtrl', function ($scope, loader, $http, security, config, canClose, zIndex, close) {
    'use strict';

    var
      self = this;

    $scope.zIndex = zIndex;
    self.model = {};
    self.canClose = canClose;

    self.title = 'Please Enter your Credentials';

    loader.invasiveInvisible();
    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      doLogin: function (valid) {

        if (self.saving || !valid) {
          return;
        }

        self.saving = true;

        return $http.post(config.CAS_URL + '/login', self.model).then(function (resp) {
          security.setUserData(resp.data);
          close('logged');
        }).catch(function (resp) {
          switch (resp.status) {
            case 400:
              $scope.loginForm['name'].$setValidity('invalid-credentials', false);
              if (!$scope.loginForm['name'].$validators['invalid-credentials']) {
                $scope.loginForm['name'].$validators['invalid-credentials'] = function () {
                  return true;
                };
              }
              break;
            default:

              break;
          }
        }).finally(function () {
          self.saving = false;
        });
      }
    };


  });
