angular.module('testClientGulp', [
  'ngAnimate',
  'ngSanitize',
  'ngTouch',
  'ngResource',
  'ngMessages',
  'ui.router',
  'ui.bootstrap',
  'angularModalService',
  'smart-table',
  'ui.select'
])
  .config(function ($httpProvider) {
    'use strict';
    $httpProvider.interceptors.push('httpInterceptor');


  })
  .run(function ($rootScope, routing, security, ModalService, loader) {
    'use strict';
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
  });
