/**
 * @ngdoc service
 * @name testClientGulp.routing
 * @description
 * # routing
 * provider in the testClientGulp.
 */
angular.module('testClientGulp')
  .provider('routing', function ($stateProvider, $locationProvider, $urlRouterProvider) {
    'use strict';

    var
      self = this;

    self.routes = {

      base: {
        name: 'base',
        abstract: true,
        controller: 'BaseCtrl as Base',
        templateUrl: '/views/base.html',
        resolve: {
          resolvedConfig: ['config', 'errorService', function (config) {
            return config.$promise
          }],
          resolvedSecurity: ['resolvedConfig', '$http', 'security', function (resolvedConfig, $http, security) {
            return $http.get(resolvedConfig.CAS_URL + '/validate', {
              loginDlgConf: {
                canClose: false
              }
            }).then(function (resp) {
              security.setUserData(resp.data);
            })
          }]
        }
      },
      home: {
        name: 'base.home',
        abstract: true,
        controller: 'HomeCtrl as Home',
        templateUrl: '/views/home.html'
      },
      help: {
        name: 'base.home.help',
        url: '^/help',
        controller: 'HelpCtrl as Help',
        templateUrl: '/views/help/help.html'
      },
      employees: {
        name: 'base.home.employees',
        url: '^/employees',
        controller: 'EmployeesCtrl as Employees',
        templateUrl: '/views/employees/employees.html'
        //,resolve:{
        //  test: ['$q', '$timeout', function($q, $timeout){
        //    var def = $q.defer();
        //    $timeout(function () {
        //      def.resolve();
        //    }, 2000);
        //    return def.promise;
        //  }]
        //}
      },
      offices: {
        name: 'base.home.offices',
        url: '^/offices',
        controller: 'OfficesCtrl as Offices',
        templateUrl: '/views/offices/offices.html'

      },
      clients: {
        name: 'base.home.clients',
        url: '^/clients',
        controller: 'ClientsCtrl as Clients',
        templateUrl: '/views/clients/clients.html'
      },
      providers: {
        name: 'base.home.providers',
        url: '^/providers',
        controller: 'ProvidersCtrl as Providers',
        templateUrl: '/views/providers/providers.html'
      }
    };

    for (var route in self.routes) {
      if (self.routes.hasOwnProperty(route)) {
        $stateProvider.state(self.routes[route]);
      }
    }

    //$locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/help');


    self.$get = function ($state, loader, $rootScope, ModalService, security) {
      function go2State(routeName, params, options) {
        var
          currentUrl,
          toUrl;
        if (self.routes[routeName]) {

          currentUrl = $state.href($state.current.name, $state.$current.locals.globals.$stateParams);
          toUrl = $state.href(self.routes[routeName].name, params);

          if (currentUrl !== toUrl) {
            return $state.go(self.routes[routeName].name, params, options);
          }
        } else {
          throw new Error('Non existing route.');
        }

      }

      return {
        routes: self.routes,
        go2State: go2State
      };
    };
  });
