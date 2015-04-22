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
      home: {
        name: 'home',
        abstract: true,
        url: '/',
        controller: 'HomeCtrl as Home',
        templateUrl: '/views/home.html',
        resolve: {
          config: ['$http', 'errorService', 'config', function ($http, errorService, config) {
            return $http.get('/assets/config.json').then(function (resp) {
              if (!_.isObject(resp.data)) {
                throw new Error('Invalid System Configuration');
              }

              config.setConfig(resp.data);
              return resp.data;
            }).catch(function (resp) {
              if (resp instanceof Error) {
                errorService.showError({
                  data: resp
                });
                throw resp;
              } else {
                errorService.showError(resp, {
                  404: 'System Configuration not Found'
                });
                throw new Error('System Configuration not Found');
              }

            });
            //success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            //}).
            //error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            //});

          }]
        }
      },
      employees: {
        name: 'home.employees',
        url: 'employees',
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
        name: 'home.offices',
        url: 'offices',
        controller: 'OfficesCtrl as Offices',
        templateUrl: '/views/offices/offices.html'

      },
      clients: {
        name: 'home.clients',
        url: 'clients',
        controller: 'ClientsCtrl as Clients',
        templateUrl: '/views/clients/clients.html'
      },
      providers: {
        name: 'home.providers',
        url: 'providers',
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
    $urlRouterProvider.otherwise('/employees');


    self.$get = function ($state, loader, $rootScope, ModalService) {
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          ModalService.closeAll();
          loader.nonInvasiveVisible();
        }
      );

      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          loader.nonInvasiveInvisible();
        }
      );

      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams) {
          loader.nonInvasiveInvisible();
        }
      );
      return {
        routes: self.routes,
        go2State: function (routeName, params, options) {
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
      };
    };
  });
