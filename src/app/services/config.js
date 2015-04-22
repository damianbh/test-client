angular.module('testClientGulp')
  .service('config', function () {
    'use strict';

    var
      self = this;

    self.setConfig = function (newConfig) {
      _.extend(self, newConfig);
    };

  });
