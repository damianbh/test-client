angular.module('testClientGulp')
  .service('security', function ($q) {
    'use strict';
    var
      self = this,
      userData;

    self.setUserData = function (newUserData) {
      userData = newUserData;
    };

    self.getUserData = function () {
      return userData;
    };

    self.getTicket = function () {
      return userData && userData.ticket;
    };
  });
