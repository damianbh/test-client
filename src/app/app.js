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

(function bootstrap() {
  function createXMLHttpRequest() {
    try {
      return new XMLHttpRequest();
    } catch (e) {
    }
    try {
      return new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
    }
    alert('XMLHttpRequest not supported');
    return null;
  }

  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ['testClientGulp']);
    });
  }

  var xhReq = createXMLHttpRequest();
  xhReq.open('GET', '/assets/config.json', true);
  xhReq.onreadystatechange = function () {
    if (xhReq.readyState != 4) {
      return;
    }

    if (xhReq.status != 200) {
      alert('Error Loading System Configuration');
      return;
    }
    $config = angular.fromJson(xhReq.responseText);
    bootstrapApplication();
  };
  xhReq.send(null);
})();
