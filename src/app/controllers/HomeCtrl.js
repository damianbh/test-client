/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('HomeCtrl', function ($scope, routing, loader) {
    'use strict';
    var
      self = this;

    self.list = [
      {
        state: 'employees',
        iconCls: 'icon-users',
        label: 'Employees',
        active: true
      }, {
        state: 'offices',
        iconCls: 'icon-library',
        label: 'Offices'
      }, {
        state: 'clients',
        iconCls: 'icon-user-tie',
        label: 'Clients'
      }, {
        state: 'providers',
        iconCls: 'icon-truck',
        label: 'Providers'
      }
    ];
  });
