/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalLoginCtrl', function ($scope, loader, errorService, $http, config, security, canClose, close) {
    'use strict';

    var
      self = this;

    self.model = {};
    self.canClose = canClose;

    self.title = 'Please Enter your Credentials';


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
        loader.invasiveVisible();
        return $http.post(config.CAS_URL + '/login', self.model).then(function (resp) {
          security.setUserData(resp.data);
          close('logged');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.officeForm);
        }).finally(function () {
          loader.invasiveInvisible();
          self.saving = false;
        });
      }
    };


  });
