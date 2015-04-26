/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('HomeCtrl', function ($scope, config, $http, loader, ModalService, security) {
    'use strict';
    var
      self = this,
      roles = security.getUserData().roles || [];

    self.security = security;
    self.CAS_URL = config.CAS_URL;
    self.list = [{
      state: 'help',
      iconCls: 'icon-question',
      label: 'Help'
    }];
    if (_.intersection(['human_resources'], roles).length) {
      self.list.push({
        state: 'employees',
        iconCls: 'icon-users',
        label: 'Employees'
      });
    }

    if (_.intersection(['director'], roles).length) {
      self.list.push(
        {
          state: 'offices',
          iconCls: 'icon-library',
          label: 'Offices'
        }
      );
    }

    //self.list = [
    //  {
    //    state: 'clients',
    //    iconCls: 'icon-user-tie',
    //    label: 'Clients'
    //  }, {
    //    state: 'providers',
    //    iconCls: 'icon-truck',
    //    label: 'Providers'
    //  }
    //];

    self.on = {
      doLogout: function () {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to logout?',
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
            message: 'You will be logged out of the Central Authorization Server which means you will be logged out of this and all other related Applications.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                $http.get(config.CAS_URL + '/logout').then(
                  function () {
                    loader.invasiveInvisible();
                    window.location = '/';
                  }
                );
                break;

              default:

            }
          });
        });

      }
    };

  });
