/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('LoginCtrl', function ($scope, loader, $http, security, config, routing) {
    'use strict';

    var
      self = this;

    self.model = {};

    self.on = {
      doLogin: function (valid) {

        if (self.saving || !valid) {
          return;
        }

        self.saving = true;
        loader.invasiveVisible();
        return $http.post(config.CAS_URL + '/login', self.model).then(function (resp) {
          security.setSecurityData(resp.data);
          return routing.go2State('help');
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
          loader.invasiveInvisible();
        });
      }
    };


  });
