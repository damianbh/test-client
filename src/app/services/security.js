angular.module('testClientGulp')
  .service('security', function ($http, errorService, config) {
    'use strict';
    var
      self = this,
      userData = $security || {};

    //self.$promise = $http.get(config.CAS_URL + '/validate', {
    //  doNotHandleErrors: true
    //}).then(function (resp) {
    //  userData = resp.data;
    //}).catch(function (resp) {
    //  if (resp.status !== 401) {
    //    errorService.showError(resp);
    //  }
    //});

    self.setSecurityData = function (newData) {
      userData = newData;
    };

    self.getSecurityData = function () {
      return userData;
    };

    self.getTicket = function () {
      return userData && userData.ticket;
    };
  });
