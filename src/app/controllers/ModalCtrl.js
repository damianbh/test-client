
/**
 * @ngdoc function
 * @name testClientGulp.controller:ModalCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalCtrl', function ($scope, title, buttons, message, zIndex, close) {
    'use strict';
    var self = this;
    $scope.title = title;
    $scope.message = message;
    $scope.buttons = [];
    if (zIndex) {
      $scope.zIndexStyle = {
        'z-index': zIndex
      };
    }
    _.each(_.keys(buttons), function (key) {
      $scope.buttons.push(angular.extend({
        result: key
      }, buttons[key]));
    });

    $scope.close = function (action) {
      close(action);
    };

  });
