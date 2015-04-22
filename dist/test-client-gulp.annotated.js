
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
  .config(function () {
    'use strict';

  });

/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ProvidersCtrl', ["$scope", "$resource", "callServer", "ProviderModel", "ModalService", "loader", "errorService", function ($scope, $resource, callServer, ProviderModel, ModalService, loader, errorService) {
    'use strict';

    var ctrl = this;

    ctrl.callServer = _.partial(callServer, {ctrl: ctrl, Resource: ProviderModel, qf: 'name,descr,phone,address'});

    $scope.$on('$saved-provider', function (event, provider, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === provider.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, provider);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, provider);
      }
      provider.$isSelected = true;
    });

    ctrl.on = {
      newOptsClick: function () {
        //console.log($scope);
        ModalService.showModal({
          templateUrl: '/views/providers/providerDlg.html',
          controller: 'ModalProviderCtrl as ModalProvider',
          inputs: {
            provider: new ProviderModel()
          }
        });
      },
      editOptsClick: function (row) {
        var
          provider = ProviderModel.get({id: row.id});
        loader.invasiveVisible();
        provider.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/providers/providerDlg.html',
            controller: 'ModalProviderCtrl as ModalProvider',
            inputs: {
              provider: provider
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });

      },
      deleteOptsClick: function (row) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete provider?',
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
            message: 'Once Deleted, you will not be able to recover it.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                row.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).catch(function (resp) {
                  if (_.isObject(resp.data) && resp.data.code === 'CONSTRAINT_ERROR') {
                    resp.data.message = 'Provider cannot be deleted because it has clients assigned';
                  }
                  errorService.showError(resp);
                }).finally(function () {
                  loader.invasiveInvisible();
                });
                break;

              default:

            }
          });
        });
      }
    };


  }]);


/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalProviderCtrl', ["$scope", "$rootScope", "provider", "loader", "errorService", "close", function ($scope, $rootScope, provider, loader, errorService, close) {
    'use strict';

    var
      self = this;

    self.model = provider;

    self.title = (provider.id ? 'Edit Provider' : 'New Provider');

    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = provider.id;
        if (self.saving || !valid) {
          return;
        }

        self.saving = true;
        loader.invasiveVisible();
        return provider.$save().then(function () {
          $rootScope.$broadcast('$saved-provider', provider, isEdit);
          close('saved');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.providerForm);
        }).finally(function () {
          loader.invasiveInvisible();
          self.saving = false;
        });
      }
    };


  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('OfficesCtrl', ["$scope", "OfficeModel", "callServer", "loader", "errorService", "ModalService", function ($scope, OfficeModel, callServer, loader, errorService, ModalService) {
    'use strict';

    var ctrl = this;

    $scope.$on('$saved-office', function (event, office, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === office.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, office);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, office);
      }
      office.$isSelected = true;
    });

    ctrl.callServer = _.partial(callServer, {ctrl:ctrl, Resource:OfficeModel, qf:'name'});
    ctrl.on = {
      newOptsClick: function () {
        //console.log($scope);
        ModalService.showModal({
          templateUrl: '/views/offices/officeDlg.html',
          controller: 'ModalOfficeCtrl as ModalOffice',
          inputs: {
            office: new OfficeModel()
          }
        });
      },
      editOptsClick: function (row) {
        var
          office = OfficeModel.get({id: row.id});
        loader.invasiveVisible();
        office.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/offices/officeDlg.html',
            controller: 'ModalOfficeCtrl as ModalOffice',
            inputs: {
              office: office
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });

      },
      deleteOptsClick: function (row) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete office?',
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
            message: 'Once Deleted, you will not be able to recover it.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                row.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).catch(function (resp) {
                  if (_.isObject(resp.data) && resp.data.code === 'CONSTRAINT_ERROR') {
                    resp.data.message = 'Office cannot be deleted because it has employees assigned';
                  }
                  errorService.showError(resp);
                }).finally(function () {
                  loader.invasiveInvisible();
                });
                break;

              default:

            }
          });
        });
      }
    };


  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalOfficeCtrl', ["$scope", "$rootScope", "office", "loader", "errorService", "close", function ($scope, $rootScope, office, loader, errorService, close) {
    'use strict';

    var
      self = this;

    self.model = office;

    self.title = (office.id ? 'Edit Office' : 'New Office');


    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = office.id;
        if (self.saving || !valid) {
          return;
        }

        self.saving = true;
        loader.invasiveVisible();
        return office.$save().then(function () {
          $rootScope.$broadcast('$saved-office', office, isEdit);
          close('saved');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.officeForm);
        }).finally(function () {
          loader.invasiveInvisible();
          self.saving = false;
        });
      }
    };


  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalEmployeeCtrl', ["$scope", "$rootScope", "employee", "OfficeModel", "loader", "errorService", "close", function ($scope, $rootScope, employee, OfficeModel, loader, errorService, close) {
    'use strict';

    var
      self = this;

    self.model = employee;

    self.title = (employee.id ? 'Edit Employee' : 'New Employee');


    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = employee.id;
        if (self.saving || !valid) {
          return;
        }
        self.saving = true;
        loader.invasiveVisible();
        return employee.$save().then(function () {
          $rootScope.$broadcast('$saved-employee', employee, isEdit);
          close('saved');
        }).catch(function (resp) {
          errorService.formError(resp, $scope.employeeForm);
        }).finally(function () {
          self.saving = false;
          loader.invasiveInvisible();
        });
      },
      refreshOffices: function (search) {
        var
          params = {
            q: search,
            sort: 'name',
            qf: 'name'
          };

        $scope.offices = OfficeModel.query(params);
        return $scope.offices.$promise.catch(function (resp) {
          errorService.showError(resp);
        });
        //return $http.get(
        //  'http://maps.googleapis.com/maps/api/geocode/json',
        //  {params: params}
        //).then(function(response) {
        //    $scope.addresses = response.data.results
        //  });
      }
    };


  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('EmployeesCtrl', ["$scope", "callServer", "EmployeeModel", "ModalService", "$timeout", "loader", "errorService", function ($scope, callServer, EmployeeModel, ModalService, $timeout, loader, errorService) {
    'use strict';

    var ctrl = this;

    //$resource(
    //  'http://tizenesmoneyserver.jit.su/History/', {}, {
    //    get: {
    //      method: 'GET',
    //      transformRequest: function (data, headers) {
    //        headers = {'Content-Type': 'application/json'};
    //        console.log(data);
    //        return data;
    //      },
    //      transformResponse: function (data, headers) {
    //        console.log(data);
    //        return data;
    //      }
    //    }
    //  }
    //);

    //ctrl.smartTable.displayed = [];


    $scope.$on('$saved-employee', function (event, employee, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === employee.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, employee);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, employee);
      }
      employee.$isSelected = true;
    });

    ctrl.callServer = _.partial(callServer, {ctrl: ctrl, Resource: EmployeeModel, qf:'firstName,lastName,initials'});
    ctrl.on = {
      newOptsClick: function () {
        //console.log($scope);
        ModalService.showModal({
          templateUrl: '/views/employees/employeeDlg.html',
          controller: 'ModalEmployeeCtrl as ModalEmployee',
          inputs: {
            employee: new EmployeeModel()
          }
        });
      },
      editOptsClick: function (row) {
        var
          employee = EmployeeModel.get({id: row.id});
        loader.invasiveVisible();
        employee.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/employees/employeeDlg.html',
            controller: 'ModalEmployeeCtrl as ModalEmployee',
            inputs: {
              employee: employee
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });

      },
      deleteOptsClick: function (employee) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete employee?',
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
            message: 'Once Deleted, you will not be able to recover it.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                employee.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).catch(function (resp) {
                  errorService.showError(resp);
                }).finally(function () {
                  loader.invasiveInvisible();
                });
                break;

              default:

            }
          });
        });
      }
    };
  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalClientViewCtrl', ["$scope", "client", "$resource", "config", "callServer", "close", function ($scope, client, $resource, config, callServer, close) {
    'use strict';
    var self = this;

    self.model = client;
    self.callServer = _.partial(callServer, {
      ctrl: self,
      Resource: $resource(config.API_URL + 'api/clients/' + client.id + '/providers'),
      qf: 'name,descr,address,phone',
      resultsPerPage: 4
    });

    self.on = {
      close: function (action) {
        close(action);
      }
    };

  }]);


/**
 * @ngdoc function
 * @name testClientGulp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalClientCtrl', ["$scope", "$rootScope", "client", "providers", "loader", "errorService", "$timeout", "$http", "config", "close", function ($scope, $rootScope, client, providers, loader, errorService, $timeout, $http, config, close) {
    'use strict';
    var
      self = this;

    $scope.providers = providers;
    if (!_.isArray(client.Providers)) {
      client.Providers = [];
    }

    self.model = client;

    self.title = (client.id ? 'Edit Client' : 'New Client');


    //self.offices = $resource(API_URL + "api/offices/:id").query();
    self.on = {
      close: function (action) {
        close(action);
      },
      saveData: function (valid) {
        var
          isEdit = client.id;
        if (self.saving || !valid) {
          return;
        }
        self.saving = true;
        loader.invasiveVisible();
        //return $http.post(config.API_URL + 'api/clients/' + client.id + '/providers', client.Providers).then(function () {
        return client.$save().then(function () {
          $rootScope.$broadcast('$saved-client', client, isEdit);
          close('saved');

        }).catch(function (resp) {
          errorService.formError(resp, $scope.clientForm);
        }).finally(function () {
          self.saving = false;
          loader.invasiveInvisible();
        });
        //  }
        //).catch(function (resp) {
        //    errorService.showError(resp);
        //  });

      }
    };


  }]);

/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ClientsCtrl', ["$scope", "callServer", "config", "ClientModel", "loader", "errorService", "ModalService", "ProviderModel", "$q", function ($scope, callServer, config, ClientModel, loader, errorService, ModalService, ProviderModel, $q) {
    'use strict';
    var ctrl = this;


    $scope.$on('$saved-client', function (event, client, isEdit) {
      if (isEdit) {
        var index = _.findIndex(ctrl.smartTable.rowCollection, function (item) {
          return (item.id === client.id);
        });
        if (index !== -1) {
          ctrl.smartTable.rowCollection.splice(index, 1, client);
        }
      } else {
        ctrl.smartTable.rowCollection.splice(0, 0, client);
      }
      client.$isSelected = true;
    });

    ctrl.callServer = _.partial(callServer, {ctrl: ctrl, Resource: ClientModel, qf: 'name,email,phone'});
    ctrl.on = {
      newOptsClick: function () {
        var providers = ProviderModel.query();
        loader.invasiveVisible();
        providers.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/clients/clientDlg.html',
            controller: 'ModalClientCtrl as ModalClient',
            inputs: {
              client: new ClientModel(),
              providers: providers
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });

      },
      viewOptsClick: function (row) {
        var
          client = ClientModel.get({id: row.id});

        loader.invasiveVisible();
        client.$promise.then(function () {
          ModalService.showModal({
            templateUrl: '/views/clients/clientViewDlg.html',
            controller: 'ModalClientViewCtrl as ModalClientView',
            inputs: {
              client: client
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });
      },
      editOptsClick: function (row) {
        var
          client = ClientModel.get({id: row.id}),
          providers = ProviderModel.query();
        loader.invasiveVisible();
        $q.all([client.$promise, providers.$promise]).then(function () {
          ModalService.showModal({
            templateUrl: '/views/clients/clientDlg.html',
            controller: 'ModalClientCtrl as ModalClient',
            inputs: {
              client: client,
              providers: providers
            }
          });
        }).catch(function (resp) {
          errorService.showError(resp);
        }).finally(function () {
          loader.invasiveInvisible();
        });

      },
      deleteOptsClick: function (client) {
        ModalService.showModal({
          templateUrl: '/views/modalConfirm.html',
          controller: 'ModalCtrl',
          inputs: {
            title: 'Are you sure you want to delete client?',
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
            message: 'Once Deleted, you will not be able to recover it.'
          }
        }).then(function (modal) {
          modal.close.then(function (result) {
            switch (result) {
              case 'yes':
                loader.invasiveVisible();
                client.$delete().then(function () {
                  ctrl.smartTable.api.slice(0, ctrl.smartTable.resultsPerPage);
                }).catch(function (resp) {
                  errorService.showError(resp);
                }).finally(function () {
                  loader.invasiveInvisible();
                });
                break;

              default:

            }
          });
        });
      }
    };
  }]);

/**
 * @ngdoc service
 * @name testClientGulp.routing
 * @description
 * # routing
 * provider in the testClientGulp.
 */
angular.module('testClientGulp')
  .provider('routing', ["$stateProvider", "$locationProvider", "$urlRouterProvider", function ($stateProvider, $locationProvider, $urlRouterProvider) {
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
            //var def = $q.defer();
            //$timeout(function () {
            //  def.resolve();
            //}, 2000);
            //return def.promise;
          }]
        }
      },
      employees: {
        name: 'home.employees',
        url: 'employees',
        controller: 'EmployeesCtrl as Employees',
        templateUrl: '/views/employees/employees.html'
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


    self.$get = ["$state", "loader", "$rootScope", function ($state, loader, $rootScope) {
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
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
    }];
  }]);

angular.module('testClientGulp')
  .service('loader', function () {
    'use strict';

    var
      self = this,
      nonInvasiveVisible = false,
      invasiveVisible = false;

    self.nonInvasiveVisible = function () {
      nonInvasiveVisible = true;
    };

    self.nonInvasiveInvisible = function () {
      nonInvasiveVisible = false;
    };

    self.getNonInvasiveVisible = function () {
      return nonInvasiveVisible;
    };

    self.invasiveVisible = function () {
      invasiveVisible = true;
    };

    self.invasiveInvisible = function () {
      invasiveVisible = false;
    };

    self.getInvasiveVisible = function () {
      return invasiveVisible;
    };
  });

angular.module('testClientGulp')
  .service('errorService', ["ModalService", function (ModalService) {
    'use strict';

    var
      self = this,
      codes = {
        0: 'General Network Error. Please check your internet connection to Api Server',
        100: 'CONTINUE',
        101: 'SWITCHING_PROTOCOLS',
        200: 'OK',
        201: 'CREATED',
        202: 'ACCEPTED',
        203: 'NON-AUTHORITATIVE_INFORMATION',
        204: 'NO_CONTENT',
        205: 'RESET_CONTENT',
        206: 'PARTIAL_CONTENT',
        300: 'MULTIPLE_CHOICES',
        301: 'MOVED_PERMANENTLY',
        302: 'FOUND',
        303: 'SEE_OTHER',
        304: 'NOT_MODIFIED',
        305: 'USE_PROXY',
        306: '(UNUSED)',
        307: 'TEMPORARY_REDIRECT',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request Uri Too Long',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'Http Version Not Supported'
      };

    self.formError = function (response, form, fieldTrans, errorExt) {
      var
        msg = '';

      if (_.isObject(response.data) && response.data.code === 'VALIDATION_ERROR' &&
        _.isObject(response.data.errors)) {
        fieldTrans = _.isObject(fieldTrans) ? fieldTrans : {};
        _.each(_.keys(response.data.errors), function (key) {
            _.each(_.keys(response.data.errors[key]), function (errKey) {
              var
                validator = function () {
                  return true;
                };
              if (fieldTrans[key]) {
                key = fieldTrans[key];
              }
              if (form[key]) {
                form[key].$setValidity(errKey, false);
                if (!form[key].$validators[errKey]) {
                  form[key].$validators[errKey] = validator;
                }
              } else {
                msg = msg + ' Validation ' + errKey + ' failed to field ' + key;
              }
            });
          }
        );
        if (msg !== '') {
          response.data.message = response.data.message ? response.data.message : '';
          response.data.message = response.data.message + ' ' + msg;
          self.showError(response, errorExt);
        }
      } else {
        self.showError(response, errorExt);
      }

    };

    self.showError = function (response, errorExt) {
      var
        message;

      if (_.isObject(response.data) && response.data.message) {
        message = response.data.message;
      } else {
        if (!_.isUndefined(response.status)) {
          if (!_.isObject(errorExt)) {
            errorExt = {};
          }
          var
            codExt = _.extend({}, codes, errorExt);
          message = codExt[response.status];
        }

      }

      if (!message) {
        message = 'Unknown Error';
      }

      ModalService.showModal({
        templateUrl: '/views/modalError.html',
        controller: 'ModalCtrl',
        inputs: {
          title: 'An error has occurred',
          buttons: {
            ok: {
              type: 'primary',
              text: 'Close'
            }
          },
          message: message
        }
      }).then(function (modal) {
        modal.close.then(function (result) {
          switch (result) {
            case 'ok':

              break;

            default:

          }
        });
      });
    };

  }]);

angular.module('testClientGulp')
  .service('config', function () {
    'use strict';

    var
      self = this;

    self.setConfig = function (newConfig) {
      _.extend(self, newConfig);
    };

  });

angular.module('testClientGulp')
  .factory('callServer', ["config", "$timeout", "errorService", function (config, $timeout, errorService) {
    'use strict';

    return function (opts, tableState, api) {
      var
        ctrl = opts.ctrl,
        Resource = opts.Resource,
        qf = opts.qf,
        extraParams = opts.extraParams || {},
        resultsPerPage = opts.resultsPerPage || config.RESULTS_PER_PAGE;

      tableState.pagination.number = resultsPerPage;
      tableState.pagination.start = tableState.pagination.start || 0;

      ctrl.smartTable = ctrl.smartTable ? ctrl.smartTable : {};

      ctrl.smartTable.isLoading = true;

      var pagination = tableState.pagination,
        offset = pagination.start || 0,     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        limit = pagination.number || resultsPerPage,   // Number of entries showed per page.
        params = {
          q: tableState.search.predicateObject && tableState.search.predicateObject.$,
          offset: offset,
          limit: limit,
          qf: qf
        };

      if (tableState.sort.predicate) {
        params.sort = tableState.sort.predicate;
        if (tableState.sort.reverse) {
          params.sort = '-' + params.sort;
        }
      }
      Resource.query(_.extend({}, params, extraParams), function (data, headersFn) {
        var
          headers = headersFn(),
          total = headers['content-range'].split('/')[1];

        total = parseInt(total);

        ctrl.smartTable.contentRange = headers['content-range'];
        api.rowCollection = data;
        ctrl.smartTable.rowCollection = data;
        ctrl.smartTable.isLoading = false;
        ctrl.smartTable.api = api;
        ctrl.smartTable.resultsPerPage = resultsPerPage;
        tableState.pagination.numberOfPages = Math.ceil(total / limit);

        //$rootScope.$apply();
        if (ctrl.smartTable.rowCollection.length) {
          ctrl.smartTable.rowCollection[0].$isSelected = true;
        }

      }).$promise.catch(function (resp) {
          ctrl.smartTable.isLoading = false;
          tableState.pagination.numberOfPages = 0;
          errorService.showError(resp);
        });
    };
  }]);

angular.module('testClientGulp')
  .factory('ProviderModel', ["$resource", "config", function ($resource, config) {
    'use strict';

    return $resource(config.API_URL + 'api/providers/:id', {id: '@id'});
  }]);

angular.module('testClientGulp')
  .factory('OfficeModel', ["$resource", "config", function ($resource, config) {
    'use strict';

    return $resource(config.API_URL + 'api/offices/:id', {id: '@id'});
  }]);

angular.module('testClientGulp')
  .factory('EmployeeModel', ["$resource", "config", function ($resource, config) {
    'use strict';

    return $resource(config.API_URL + 'api/employees/:id', {id: '@id'});
  }]);

angular.module('testClientGulp')
  .factory('ClientModel', ["$resource", "config", function ($resource, config) {
    'use strict';

    return $resource(config.API_URL + 'api/clients/:id', {id: '@id'});
  }]);

/**
 * Created by damian on 4/12/2015.
 */
angular.module('testClientGulp').filter('propsFilter', function () {
  'use strict';
  return function (items, props) {

    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function (item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

angular.module('testClientGulp')
  .directive('stSelectedRow', ['stConfig', function (stConfig) {
    'use strict';
    return {
      restrict: 'A',
      require: '^stTable',
      scope: {
        row: '=stSelectedRow'
      },
      link: function (scope, element, attr, ctrl) {

        function doSelect(newValue) {
          if (newValue === true) {
            _.each(_.without(ctrl.rowCollection, scope.row), function (item) {
              if (!_.isUndefined(item.$isSelected)) {
                item.$isSelected = false;
              }
            });
            element.addClass(stConfig.select.selectedClass);
          } else {
            element.removeClass(stConfig.select.selectedClass);
          }
        }

        element.bind('click', function () {
          scope.$apply(function () {
            scope.row.$isSelected = true;
          });
        });

        doSelect(scope.row.$isSelected);

        scope.$watch('row.$isSelected', function (newValue) {
          doSelect(newValue);
        });
      }
    };
  }]);

/**
 * @ngdoc directive
 * @name testClientGulp.directive:msSref
 * @description
 * # msFocus
 */
angular.module('testClientGulp')
  .directive('msFocus', ["$timeout", function ($timeout) {
    'use strict';

    return {
      restrict: 'A',

      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return scope.$eval(attrs.msFocus);
        }, function (newValue) {
          if (newValue == true) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  }]);

/**
 * Created by damian on 2/23/2015.
 */
angular.module('testClientGulp')
  .directive('activeList', function () {
    'use strict';

    return {
      controller: ["$scope", "routing", function ($scope, routing) {

        $scope.click = function (item) {
          //var promise =
          routing.go2State(item.state);
          //if (promise) {
          //  promise.then(function () {
          //    $scope.itemList.forEach(function (item) {
          //      item.active = false;
          //    });
          //    item.active = true;
          //
          //  });
          //}
        };

        $scope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {

            for (var name in routing.routes) {
              if (routing.routes.hasOwnProperty(name) && (routing.routes[name].name == toState.name)) {
                $scope.itemList.forEach(function (item) {
                  item.active = (item.state === name);
                });
              }
            }

          }
        );
      }],
      replace: true,
      template: '<ul class="{{ maincls }}">' +
      '<li ng-repeat="item in itemList" ng-class="{active:item.active,standard:!item.active}">' +
      '<a ng-click="click(item)">' +
      '<i class="{{ item.iconCls }}" ng-if="item.iconCls"></i> ' +
      '<span ng-if="item.label">{{ item.label }}</span>' +
      '</a>' +
      '</li>' +
        '<img ng-if="imgSrc" class="pull-right" style="margin-right: 20px;" height="55px" ng-src="{{imgSrc}}" alt=""/>'+
      '</ul>',
      restrict: 'E',
      scope: {
        itemList: '=list',
        maincls: '=maincls',
        imgSrc: '=imgSrc'
      }
    };
  });


/**
 * @ngdoc function
 * @name testClientGulp.controller:ModalCtrl
 * @description
 * # AppCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('ModalCtrl', ["$scope", "title", "buttons", "message", "zIndex", "close", function ($scope, title, buttons, message, zIndex, close) {
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

  }]);


/**
 * @ngdoc function
 * @name testClientGulp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testClientGulp
 */
angular.module('testClientGulp')
  .controller('HomeCtrl', ["$scope", "routing", "loader", function ($scope, routing, loader) {
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

    self.loaderSvc = loader;
  }]);

//  angularModalService.js
//
//  Service for showing modal dialogs.

/***** JSLint Config *****/
/*global angular  */
(function () {

  'use strict';

  var module = angular.module('angularModalService', []);

  module.factory('ModalService', ['$document', '$compile', '$controller', '$http', '$rootScope', '$q', '$timeout', '$templateCache',
    function ($document, $compile, $controller, $http, $rootScope, $q, $timeout, $templateCache) {

      //  Get the body of the document, we'll add the modal to this.
      var body = $document.find('body');

      function ModalService() {

        var self = this,
          closeFns = [],
          zIndex = 100;

        //  Returns a promise which gets the template, either
        //  from the template parameter or via a request to the
        //  template url parameter.
        var getTemplate = function (template, templateUrl) {
          var deferred = $q.defer();
          if (template) {
            deferred.resolve(template);
          } else if (templateUrl) {
            // check to see if the template has already been loaded
            var cachedTemplate = $templateCache.get(templateUrl);
            if (cachedTemplate !== undefined) {
              deferred.resolve(cachedTemplate);
            }
            // if not, let's grab the template for the first time
            else {
              $http({method: 'GET', url: templateUrl, cache: true})
                .then(function (result) {
                  // save template into the cache and return the template
                  $templateCache.put(templateUrl, result.data);
                  deferred.resolve(result.data);
                })
                .catch(function (error) {
                  deferred.reject(error);
                });
            }
          } else {
            deferred.reject('No template or templateUrl has been specified.');
          }
          return deferred.promise;
        };

        self.closeAll = function () {
          _.each(closeFns, function (fn) {
            fn();
          });
        };

        self.showModal = function (options) {

          //  Create a deferred we'll resolve when the modal is ready.
          var deferred = $q.defer();

          //  Validate the input parameters.
          var controller = options.controller;
          if (!controller) {
            deferred.reject('No controller has been specified.');
            return deferred.promise;
          }

          //  Get the actual html of the template.
          getTemplate(options.template, options.templateUrl)
            .then(function (template) {

              //  Create a new scope for the modal.
              var modalScope = $rootScope.$new();

              //  Create the inputs object to the controller - this will include
              //  the scope, as well as all inputs provided.
              //  We will also create a deferred that is resolved with a provided
              //  close function. The controller can then call 'close(result)'.
              //  The controller can also provide a delay for closing - this is
              //  helpful if there are closing animations which must finish first.
              var closeDeferred = $q.defer(),
                fnClose = function (result, delay) {
                  if (delay === undefined || delay === null) delay = 0;
                  $timeout(function () {
                    closeDeferred.resolve(result);
                  }, delay);
                };
              var inputs = {
                $scope: modalScope,
                close: fnClose
              };
              closeFns.push(fnClose);
              zIndex++;
              //  If we have provided any inputs, pass them to the controller.
              if (options.inputs) {
                for (var inputName in options.inputs) {
                  inputs[inputName] = options.inputs[inputName];
                }
              }

              if (!inputs['zIndex']) {
                inputs['zIndex'] = zIndex;
              }

              //  Create the controller, explicitly specifying the scope to use.
              var modalController = $controller(controller, inputs),

              //  Parse the modal HTML into a DOM element (in template form).
                modalElementTemplate = angular.element(template),

              //  Compile then link the template element, building the actual element.
              //  Set the $element on the inputs so that it can be injected if required.
                linkFn = $compile(modalElementTemplate),

                modalElement = linkFn(modalScope);

              modalScope.modalElement = modalElement;
              //inputs.$element = modalElement;

              //  Finally, append the modal to the dom.
              if (options.appendElement) {
                // append to custom append element
                options.appendElement.append(modalElement);
              } else {
                // append to body when no custom append element is specified
                body.append(modalElement);
              }

              //  We now have a modal object.
              var modal = {
                controller: modalController,
                scope: modalScope,
                element: modalElement,
                close: closeDeferred.promise
              };

              //  When close is resolved, we'll clean up the scope and element.
              modal.close.then(function (result) {
                //  Clean up the scope
                modalScope.$destroy();
                //  Remove the element from the dom.
                modalElement.remove();

                closeFns = _.without(closeFns, fnClose);
                zIndex--;
              });

              deferred.resolve(modal);

            })
            .catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

      }

      return new ModalService();
    }]);

}());

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/errors.html',
    '<div class="error" ng-message="required"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="This field is mandatory, please fill it with proper information" class="label label-danger">Required</span></div><div class="error" ng-message="email"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="This field is an email, please fill it with proper information" class="label label-danger">Invalid email address</span></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/home.html',
    '<div class="non-invasive-loader" ng-if="Home.loaderSvc.getNonInvasiveVisible()"></div><div class="invasive-loader" ng-if="Home.loaderSvc.getInvasiveVisible()"><i class="icon-spinner10"></i></div><active-list maincls="\'main-bar list-inline\'" list="Home.list" img-src="\'/assets/logo.png\'"></active-list><div ui-view></div><div class="main-footer"><span class="main-footer-text pull-left">&copy; 2015 All Rights Reserved</span></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/modalConfirm.html',
    '<div class="modal-fade" ng-style="zIndexStyle"><div class="modal-overlay modal-confirm animated zoomIn"><div class="row"><div class="col-xs-12"><i ng-click="close(\'cancel\')" class="icon-cross"></i></div></div><div class="row"><div class="col-xs-10 margin-title"><span class="title">{{title}}</span></div></div><div class="row message-margin"><div class="col-xs-12"><span class="message">{{message}}</span></div></div><div class="row toolbar"><div class="col-xs-12"><button ng-repeat="button in buttons" class="btn pull-right btn-{{button.type}}" ms-focus="$index == 0" ng-click="close(\'{{button.result}}\')" style="margin-left: 10px">{{ button.text }}</button></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/modalError.html',
    '<div class="modal-fade" ng-style="zIndexStyle"><div class="modal-overlay modal-error animated zoomIn"><div class="row"><div class="col-xs-12"><i ng-click="close(\'cancel\')" class="icon-cross"></i></div></div><div class="row"><div class="col-xs-10 margin-title"><span class="title-error">{{title}}</span></div></div><div class="row message-margin"><div class="col-xs-12"><div class="alert alert-danger">{{message}}</div></div></div><div class="row"><div class="col-xs-12"><button ng-repeat="button in buttons" class="btn pull-right btn-{{button.type}}" ms-focus="$index == 0" ng-click="close(\'{{button.result}}\')" style="margin-left: 10px">{{ button.text }}</button></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/assets/icons/demo.html',
    '<!doctype html><html><head><meta charset="utf-8"><title>IcoMoon Demo</title><meta name="description" content="An Icon Font Generated By IcoMoon.io"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="demo-files/demo.css"><link rel="stylesheet" href="style.css"></head><body><div class="bgc1 clearfix"><h1 class="mhmm mvm"><span class="fgc1">Font Name:</span> icomoon <small class="fgc1">(Glyphs:&nbsp;12)</small></h1></div><div class="clearfix mhl ptl"><h1 class="mvm mtn fgc1">Grid Size: 16</h1><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-library"></span> <span class="mls">icon-library</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e600" class="unit size1of2"> <input maxlength="1" readonly value="&#xe600;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-pencil"></span> <span class="mls">icon-pencil</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e905" class="unit size1of2"> <input maxlength="1" readonly value="&#xe905;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="pencil, write" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-users"></span> <span class="mls">icon-users</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e972" class="unit size1of2"> <input maxlength="1" readonly value="&#xe972;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="users, group" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-user-tie"></span> <span class="mls">icon-user-tie</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e976" class="unit size1of2"> <input maxlength="1" readonly value="&#xe976;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="user-tie, user5" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-spinner10"></span> <span class="mls">icon-spinner10</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e983" class="unit size1of2"> <input maxlength="1" readonly value="&#xe983;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="spinner10, loading11" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-search"></span> <span class="mls">icon-search</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e986" class="unit size1of2"> <input maxlength="1" readonly value="&#xe986;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="search, magnifier" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-bin"></span> <span class="mls">icon-bin</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e9ac" class="unit size1of2"> <input maxlength="1" readonly value="&#xe9ac;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="bin, trashcan" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-truck"></span> <span class="mls">icon-truck</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e9b0" class="unit size1of2"> <input maxlength="1" readonly value="&#xe9b0;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="truck, transit" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-menu3"></span> <span class="mls">icon-menu3</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e9bf" class="unit size1of2"> <input maxlength="1" readonly value="&#xe9bf;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="menu3, options3" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-eye"></span> <span class="mls">icon-eye</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="e9ce" class="unit size1of2"> <input maxlength="1" readonly value="&#xe9ce;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="eye, views" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-plus"></span> <span class="mls">icon-plus</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="ea0a" class="unit size1of2"> <input maxlength="1" readonly value="&#xea0a;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="plus, add" class="liga unitRight"></div></div><div class="glyph fs1"><div class="clearfix bshadow0 pbs"><span class="icon-cross"></span> <span class="mls">icon-cross</span></div><fieldset class="fs0 size1of1 clearfix hidden-false"><input readonly value="ea0f" class="unit size1of2"> <input maxlength="1" readonly value="&#xea0f;" class="unitRight size1of2 talign-right"></fieldset><div class="fs0 bshadow0 clearfix hidden-true"><span class="unit pvs fgc1">liga:</span> <input readonly value="cross, cancel" class="liga unitRight"></div></div></div><!--[if gt IE 8]><!--><div class="mhl clearfix mbl"><h1>Font Test Drive</h1><label>Font Size: <input id="fontSize" type="number" class="textbox0 mbm" min="8" value="48"> px</label><input id="testText" class="phl size1of1 mvl" placeholder="Type some text to test..." value=""><div id="testDrive" class="icon-">&nbsp;</div></div><!--<![endif]--><div class="bgc1 clearfix"><p class="mhl">Generated by <a href="https://icomoon.io/app">IcoMoon</a></p></div><script src="demo-files/demo.js"></script></body></html>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/clients/clientDlg.html',
    '<div class="modal-fade"><div class="modal-overlay animated zoomIn modify-dialog"><div class="row"><div class="col-xs-10 main-title">{{ ModalClient.title}}</div><div class="col-xs-2"><i ng-click="ModalClient.on.close(\'cancel\')" class="icon-cross"></i></div></div><form name="clientForm" role="form" novalidate ng-submit="ModalClient.on.saveData(clientForm.$valid)"><div class="form-group" ng-class="{\'has-error\': ((clientForm.$submitted || clientForm.name.$touched) && clientForm.name.$invalid),\'has-success\':clientForm.name.$valid}"><div class="errors" ng-messages="clientForm.name.$error" ng-if="clientForm.$submitted || clientForm.name.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="name">Name</label><input ms-focus="true" class="form-control" id="name" name="name" placeholder="Please enter First Name" ng-model="ModalClient.model.name" required></div><div class="form-group" ng-class="{\'has-error\': ((clientForm.$submitted || clientForm.email.$touched) && clientForm.email.$invalid),\'has-success\':clientForm.email.$valid}"><div class="errors" ng-messages="clientForm.email.$error" ng-if="clientForm.$submitted || clientForm.email.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="email">Email</label><input type="email" class="form-control" id="email" name="email" placeholder="Please enter Last Name" ng-model="ModalClient.model.email" required></div><div class="form-group" ng-class="{\'has-error\': ((clientForm.$submitted || clientForm.phone.$touched) && clientForm.phone.$invalid),\'has-success\':clientForm.phone.$valid}"><div class="errors" ng-messages="clientForm.phone.$error" ng-if="clientForm.$submitted || clientForm.phone.$touched" ng-messages-include="/views/errors.html"><div class="error" ng-message="pattern"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="This field only allow numbers, please fill it with proper information" class="label label-danger">Only numbers allowed</span></div></div><label class="control-label" for="phone">Phone</label><input class="form-control" id="phone" name="phone" placeholder="Please enter Phone Number" pattern="^[0-9]*$" ng-model="ModalClient.model.phone" required></div><div class="form-group" ng-class="{\'has-error\': ((clientForm.$submitted || clientForm.Providers.$touched) && clientForm.Providers.$invalid),\'has-success\':clientForm.Providers.$valid}"><div class="errors" ng-messages="clientForm.Providers.$error" ng-if="clientForm.$submitted || clientForm.Providers.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="Providers">Providers</label><ui-select multiple id="Providers" name="Providers" ng-model="ModalClient.model.Providers" theme="bootstrap" close-on-select="false"><ui-select-match><div class="provider-item" popover="{{$item.address}}, Phone {{$item.phone}}" popover-trigger="mouseenter" popover-append-to-body="true"><i class="icon-truck"></i>{{$item.name}}, {{$item.descr}}</div></ui-select-match><ui-select-choices repeat="provider.id as provider in filteredProviders = (providers | propsFilter: {name: $select.search, descr: $select.search,address:$select.search, phone:$select.search} | orderBy: \'name\')"><div ng-bind-html="provider.name | highlight: $select.search"></div><small style="display:block">Description: <span ng-bind-html="\'\'+provider.descr | highlight: $select.search"></span></small> <small style="display:block">Phone: <span ng-bind-html="\'\'+provider.phone | highlight: $select.search"></span></small> <small style="display:block">Address: <span ng-bind-html="\'\'+provider.address | highlight: $select.search"></span></small></ui-select-choices></ui-select></div><div class="row toolbar"><div class="col-xs-12"><button type="submit" class="btn btn-primary pull-right">Save</button> <button type="button" class="btn btn-default pull-right" style="margin-right: 10px" ng-click="ModalClient.on.close(\'cancel\')">Cancel</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/clients/clientViewDlg.html',
    '<div class="modal-fade"><div class="modal-overlay animated zoomIn client-view-dialog"><div class="row"><div class="col-xs-10 main-title">View Client</div><div class="col-xs-2"><i ng-click="ModalClientView.on.close(\'cancel\')" class="icon-cross"></i></div></div><form name="clientForm" role="form" novalidate><div class="row"><div class="col-xs-6"><div class="form-group"><label class="control-label" for="name">Name</label><input class="form-control" id="name" name="name" disabled ng-model="ModalClientView.model.name" required></div></div><div class="col-xs-6"><div class="form-group"><label class="control-label" for="email">Email</label><input class="form-control" id="email" name="email" disabled ng-model="ModalClientView.model.email" required></div></div></div><div class="row"><div class="col-xs-6"><div class="form-group"><label class="control-label" for="phone">Phone</label><input class="form-control" id="phone" name="phone" disabled ng-model="ModalClientView.model.phone" required></div></div></div><table class="table table-striped" st-pipe="ModalClientView.callServer" st-table="ModalClientView.smartTable.rowCollection"><thead><tr><th colspan="3"><span class="main-tab-title">Providers</span></th><th colspan="2"><div class="input-group search-ctrol"><input st-search placeholder="Search" class="input-sm form-control" ng-model="globalSearch" type="search"> <span class="input-group-addon"><i class="icon-search"></i></span></div></th></tr><tr><th width="23%"><span st-sort="name" class="col-header">Name</span></th><th width="23%"><span st-sort="descr" class="col-header">Description</span></th><th width="23%"><span st-sort="phone" class="col-header">Phone</span></th><th width="23%"><span st-sort="address" class="col-header">Address</span></th><th width="8%"></th></tr></thead><tbody ng-if="!ModalClientView.smartTable.isLoading"><tr ng-repeat="row in ModalClientView.smartTable.rowCollection"><td ng-bind-html="row.name | highlight: globalSearch"></td><td ng-bind-html="row.descr | highlight: globalSearch"></td><td ng-bind-html="row.phone | highlight: globalSearch"></td><td colspan="2" ng-bind-html="row.address | highlight: globalSearch"></td></tr><tr ng-if="!ModalClientView.smartTable.rowCollection.length"><td colspan="5" class="text-center"><span>No Providers found</span></td></tr></tbody><tbody ng-if="ModalClientView.smartTable.isLoading"><tr><td colspan="5"><i class="icon-spinner10 grid-loader"></i></td></tr></tbody><tfoot ng-if="!ModalClientView.smartTable.isLoading"><tr><td colspan="5"><div class="text-center" st-pagination="" st-items-by-page="ModalClientView.smartTable.resultsPerPage"></div><small ng-if="ModalClientView.smartTable.rowCollection.length" class="content-range text-center">{{ModalClientView.smartTable.contentRange}}</small></td></tr></tfoot></table><div class="row toolbar"><div class="col-xs-12"><button type="button" ms-focus="true" class="btn btn-primary pull-right" ng-click="ModalClientView.on.close(\'cancel\')">Close</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/clients/clients.html',
    '<div class="main-tab"><table class="table table-striped" st-pipe="Clients.callServer" st-table="Clients.smartTable.rowCollection"><thead><tr><th colspan="3"><span class="main-tab-title">Clients</span> <a class="add-btn" popover-trigger="mouseenter" popover="New Client" ng-click="Clients.on.newOptsClick()"><i class="icon-plus"></i></a></th><th colspan="2"><div class="input-group search-ctrol"><input st-search placeholder="Search" class="input-sm form-control" ng-model="globalSearch" type="search"> <span class="input-group-addon"><i class="icon-search"></i></span></div></th></tr><tr><th width="23%"><span st-sort="name" class="col-header">Name</span></th><th width="23%"></th><th width="23%"><span st-sort="email" class="col-header">Email</span></th><th width="23%"><span st-sort="phone" class="col-header">Phone</span></th><th width="8%"></th></tr></thead><tbody ng-if="!Clients.smartTable.isLoading"><tr ng-repeat="row in Clients.smartTable.rowCollection" st-selected-row="row"><td colspan="2" ng-bind-html="row.name | highlight: globalSearch"></td><td ng-bind-html="row.email | highlight: globalSearch"></td><td ng-bind-html="row.phone | highlight: globalSearch"></td><td><span class="dropdown" dropdown><i class="dropdown-toggle icon-menu3" dropdown-toggle></i><ul class="dropdown-menu grid-menu"><li><a href ng-click="Clients.on.editOptsClick(row)"><i class="icon-pencil"></i> <span>Edit</span></a></li><li><a href ng-click="Clients.on.deleteOptsClick(row)"><i class="icon-bin"></i> <span>Delete</span></a></li><li><a href ng-click="Clients.on.viewOptsClick(row)"><i class="icon-eye"></i> <span>View</span></a></li></ul></span></td></tr><tr ng-if="!Clients.smartTable.rowCollection.length"><td colspan="5" class="text-center"><span>No Clients found</span></td></tr></tbody><tbody ng-if="Clients.smartTable.isLoading"><tr><td colspan="5"><i class="icon-spinner10 grid-loader"></i></td></tr></tbody><tfoot ng-if="!Clients.smartTable.isLoading"><tr><td colspan="5"><div class="text-center" st-pagination="" st-items-by-page="Clients.smartTable.resultsPerPage"></div><small ng-if="Clients.smartTable.rowCollection.length" class="content-range text-center">{{Clients.smartTable.contentRange}}</small></td></tr></tfoot></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/employees/employeeDlg.html',
    '<div class="modal-fade"><div class="modal-overlay animated zoomIn modify-dialog"><div class="row"><div class="col-xs-10 main-title">{{ ModalEmployee.title}}</div><div class="col-xs-2"><i ng-click="ModalEmployee.on.close(\'cancel\')" class="icon-cross"></i></div></div><form name="employeeForm" role="form" novalidate ng-submit="ModalEmployee.on.saveData(employeeForm.$valid)"><div class="form-group" ng-class="{\'has-error\': ((employeeForm.$submitted || employeeForm.firstName.$touched) && employeeForm.firstName.$invalid),\'has-success\':employeeForm.firstName.$valid}"><div class="errors" ng-messages="employeeForm.firstName.$error" ng-if="employeeForm.$submitted || employeeForm.firstName.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="firstName">First Name</label><input ms-focus="true" class="form-control" id="firstName" name="firstName" placeholder="Please enter First Name" ng-model="ModalEmployee.model.firstName" required></div><div class="form-group" ng-class="{\'has-error\': ((employeeForm.$submitted || employeeForm.lastName.$touched) && employeeForm.lastName.$invalid),\'has-success\':employeeForm.lastName.$valid}"><div class="errors" ng-messages="employeeForm.lastName.$error" ng-if="employeeForm.$submitted || employeeForm.lastName.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="lastName">Last Name</label><input class="form-control" id="lastName" name="lastName" placeholder="Please enter Last Name" ng-model="ModalEmployee.model.lastName" required></div><div class="form-group" ng-class="{\'has-error\': ((employeeForm.$submitted || employeeForm.initials.$touched) && employeeForm.initials.$invalid),\'has-success\':employeeForm.initials.$valid}"><div class="errors" ng-messages="employeeForm.initials.$error" ng-if="employeeForm.$submitted || employeeForm.initials.$touched" ng-messages-include="/views/errors.html"><div class="error" ng-message="pattern"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="This field allows only uppercase letters, please fill it with proper information" class="label label-danger">Only uppercase letters allowed</span></div></div><label class="control-label" for="initials">Initials</label><input class="form-control" id="initials" name="initials" placeholder="Please enter Initials" pattern="^[A-Z]*$" ng-model="ModalEmployee.model.initials" required></div><div class="form-group" ng-class="{\'has-error\': ((employeeForm.$submitted || employeeForm.officeId.$touched) && employeeForm.officeId.$invalid),\'has-success\':employeeForm.officeId.$valid}"><div class="errors" ng-messages="employeeForm.officeId.$error" ng-if="employeeForm.$submitted || employeeForm.officeId.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="officeId">Office</label><ui-select id="officeId" name="officeId" required ng-model="ModalEmployee.model.officeId" theme="bootstrap" reset-search-input="false"><ui-select-match placeholder="Search Offices"><i class="icon-cross" ng-click="$event.stopPropagation();ModalEmployee.model.officeId = undefined;"></i> <span>{{$select.selected.name}}</span></ui-select-match><ui-select-choices repeat="office.id as office in offices" refresh="ModalEmployee.on.refreshOffices($select.search)" refresh-delay="0"><div ng-bind-html="office.name | highlight: $select.search"></div></ui-select-choices></ui-select></div><div class="row toolbar"><div class="col-xs-12"><button type="submit" class="btn btn-primary pull-right">Save</button> <button type="button" class="btn btn-default pull-right" style="margin-right: 10px" ng-click="ModalEmployee.on.close(\'cancel\')">Cancel</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/employees/employees.html',
    '<div class="main-tab"><table class="table table-striped" st-pipe="Employees.callServer" st-table="Employees.smartTable.rowCollection"><thead><tr><th colspan="3"><span class="main-tab-title">Employees</span> <a class="add-btn" popover-trigger="mouseenter" popover="New Employee" ng-click="Employees.on.newOptsClick()"><i class="icon-plus"></i></a></th><th colspan="2"><div class="input-group search-ctrol"><input st-search placeholder="Search" class="input-sm form-control" ng-model="globalSearch" type="search"> <span class="input-group-addon"><i class="icon-search"></i></span></div></th></tr><tr><th width="23%"><span st-sort="firstName" class="col-header">First Name</span></th><th width="23%"><span st-sort="lastName" class="col-header">Last Name</span></th><th width="23%"><span st-sort="initials" class="col-header">Initials</span></th><th width="23%"><span>Office</span></th><th width="8%"></th></tr></thead><tbody ng-if="!Employees.smartTable.isLoading"><tr ng-repeat="row in Employees.smartTable.rowCollection" st-selected-row="row"><td ng-bind-html="row.firstName | highlight: globalSearch"></td><td ng-bind-html="row.lastName | highlight: globalSearch"></td><td ng-bind-html="row.initials | highlight: globalSearch"></td><td ng-bind-html="row.Office.name | highlight: globalSearch"></td><td><span class="dropdown" dropdown><i class="dropdown-toggle icon-menu3" dropdown-toggle></i><ul class="dropdown-menu grid-menu"><li><a href ng-click="Employees.on.editOptsClick(row)"><i class="icon-pencil"></i> <span>Edit</span></a></li><li><a href ng-click="Employees.on.deleteOptsClick(row)"><i class="icon-bin"></i> <span>Delete</span></a></li></ul></span></td></tr><tr ng-if="!Employees.smartTable.rowCollection.length"><td colspan="5" class="text-center"><span>No Employees found</span></td></tr></tbody><tbody ng-if="Employees.smartTable.isLoading"><tr><td colspan="5"><i class="icon-spinner10 grid-loader"></i></td></tr></tbody><tfoot ng-if="!Employees.smartTable.isLoading"><tr><td colspan="5"><div class="text-center" st-pagination="" st-items-by-page="Employees.smartTable.resultsPerPage"></div><small ng-if="Employees.smartTable.rowCollection.length" class="content-range text-center">{{Employees.smartTable.contentRange}}</small></td></tr></tfoot></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/offices/officeDlg.html',
    '<div class="modal-fade"><div class="modal-overlay animated zoomIn modify-dialog"><div class="row"><div class="col-xs-10 main-title">{{ ModalOffice.title}}</div><div class="col-xs-2"><i ng-click="ModalOffice.on.close(\'cancel\')" class="icon-cross"></i></div></div><form name="officeForm" role="form" novalidate ng-submit="ModalOffice.on.saveData(officeForm.$valid)"><div class="form-group" ng-class="{\'has-error\': ((officeForm.$submitted || officeForm.name.$touched) && officeForm.name.$invalid),\'has-success\':officeForm.name.$valid}"><div class="errors" ng-messages="officeForm.name.$error" ng-if="officeForm.$submitted || officeForm.name.$touched" ng-messages-include="/views/errors.html"><div class="error" ng-message="name_must_be_unique"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="Office name already exists. Please provide an Office name that it\'s not already registered" class="label label-danger">Office name must be unique</span></div></div><label class="control-label" for="name">Name</label><input ms-focus="true" class="form-control" id="name" name="name" placeholder="Please enter Office Name" ng-model="ModalOffice.model.name" required></div><div class="row toolbar"><div class="col-xs-12"><button type="submit" class="btn btn-primary pull-right">Save</button> <button type="button" class="btn btn-default pull-right" style="margin-right: 10px" ng-click="ModalOffice.on.close(\'cancel\')">Cancel</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/offices/offices.html',
    '<div class="main-tab"><table class="table table-striped" st-pipe="Offices.callServer" st-table="Offices.smartTable.rowCollection"><thead><tr><th colspan="3"><span class="main-tab-title">Offices</span> <a class="add-btn" popover-trigger="mouseenter" popover="New Office" ng-click="Offices.on.newOptsClick()"><i class="icon-plus"></i></a></th><th colspan="2"><div class="input-group search-ctrol"><input st-search placeholder="Search" class="input-sm form-control" ng-model="globalSearch" type="search"> <span class="input-group-addon"><i class="icon-search"></i></span></div></th></tr><tr><th width="23%"><span st-sort="id" class="col-header">Id</span></th><th width="23%"><span st-sort="name" class="col-header">Name</span></th><th width="23%"></th><th width="23%"></th><th width="8%"></th></tr></thead><tbody ng-if="!Offices.smartTable.isLoading"><tr ng-repeat="row in Offices.smartTable.rowCollection" st-selected-row="row"><td>{{row.id}}</td><td colspan="3" ng-bind-html="row.name | highlight: globalSearch"></td><td><span class="dropdown" dropdown><i class="dropdown-toggle icon-menu3" dropdown-toggle></i><ul class="dropdown-menu grid-menu"><li><a href ng-click="Offices.on.editOptsClick(row)"><i class="icon-pencil"></i> <span>Edit</span></a></li><li><a href ng-click="Offices.on.deleteOptsClick(row)"><i class="icon-bin"></i> <span>Delete</span></a></li></ul></span></td></tr><tr ng-if="!Offices.smartTable.rowCollection.length"><td colspan="5" class="text-center"><span>No Offices found</span></td></tr></tbody><tbody ng-if="Offices.smartTable.isLoading"><tr><td colspan="5"><i class="icon-spinner10 grid-loader"></i></td></tr></tbody><tfoot ng-if="!Offices.smartTable.isLoading"><tr><td colspan="5"><div class="text-center" st-pagination="" st-items-by-page="Offices.smartTable.resultsPerPage"></div><small ng-if="Offices.smartTable.rowCollection.length" class="content-range text-center">{{Offices.smartTable.contentRange}}</small></td></tr></tfoot></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/providers/providerDlg.html',
    '<div class="modal-fade"><div class="modal-overlay animated zoomIn modify-dialog"><div class="row"><div class="col-xs-10 main-title">{{ ModalProvider.title}}</div><div class="col-xs-2"><i ng-click="ModalProvider.on.close(\'cancel\')" class="icon-cross"></i></div></div><form name="providerForm" role="form" novalidate ng-submit="ModalProvider.on.saveData(providerForm.$valid)"><div class="form-group" ng-class="{\'has-error\': ((providerForm.$submitted || providerForm.name.$touched) && providerForm.name.$invalid),\'has-success\':providerForm.name.$valid}"><div class="errors" ng-messages="providerForm.name.$error" ng-if="providerForm.$submitted || providerForm.name.$touched" ng-messages-include="/views/errors.html"><div class="error" ng-message="name_must_be_unique"><span popover-append-to-body="true" popover-trigger="mouseenter" popover="Provider name already exists. Please provide a Provider name that it\'s not already registered" class="label label-danger">Provider name must be unique</span></div></div><label class="control-label" for="name">Name</label><input ms-focus="true" class="form-control" id="name" name="name" placeholder="Please enter Provider Name" ng-model="ModalProvider.model.name" required></div><div class="form-group" ng-class="{\'has-error\': ((providerForm.$submitted || providerForm.descr.$touched) && providerForm.descr.$invalid),\'has-success\':providerForm.descr.$valid}"><div class="errors" ng-messages="providerForm.descr.$error" ng-if="providerForm.$submitted || providerForm.descr.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="descr">Description</label><input class="form-control" id="descr" name="descr" placeholder="Please enter Provider Description" ng-model="ModalProvider.model.descr" required></div><div class="form-group" ng-class="{\'has-error\': ((providerForm.$submitted || providerForm.phone.$touched) && providerForm.phone.$invalid),\'has-success\':providerForm.phone.$valid}"><div class="errors" ng-messages="providerForm.phone.$error" ng-if="providerForm.$submitted || providerForm.phone.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="phone">Phone</label><input class="form-control" id="phone" name="phone" placeholder="Please enter Provider Phone" ng-model="ModalProvider.model.phone" required></div><div class="form-group" ng-class="{\'has-error\': ((providerForm.$submitted || providerForm.address.$touched) && providerForm.address.$invalid),\'has-success\':providerForm.address.$valid}"><div class="errors" ng-messages="providerForm.address.$error" ng-if="providerForm.$submitted || providerForm.address.$touched" ng-messages-include="/views/errors.html"></div><label class="control-label" for="address">Address</label><input class="form-control" id="address" name="address" placeholder="Please enter Provider Address" ng-model="ModalProvider.model.address" required></div><div class="row toolbar"><div class="col-xs-12"><button type="submit" class="btn btn-primary pull-right">Save</button> <button type="button" class="btn btn-default pull-right" style="margin-right: 10px" ng-click="ModalProvider.on.close(\'cancel\')">Cancel</button></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('testClientGulp');
} catch (e) {
  module = angular.module('testClientGulp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/views/providers/providers.html',
    '<div class="main-tab"><table class="table table-striped" st-pipe="Providers.callServer" st-table="Providers.smartTable.rowCollection"><thead><tr><th colspan="3"><span class="main-tab-title">Providers</span> <a class="add-btn" popover-trigger="mouseenter" popover="New Provider" ng-click="Providers.on.newOptsClick()"><i class="icon-plus"></i></a></th><th colspan="2"><div class="input-group search-ctrol"><input st-search placeholder="Search" class="input-sm form-control" ng-model="globalSearch" type="search"> <span class="input-group-addon"><i class="icon-search"></i></span></div></th></tr><tr><th width="23%"><span st-sort="name" class="col-header">Name</span></th><th width="23%"><span st-sort="descr" class="col-header">Description</span></th><th width="23%"><span st-sort="phone" class="col-header">Phone</span></th><th width="23%"><span st-sort="address" class="col-header">Address</span></th><th width="8%"></th></tr></thead><tbody ng-if="!Providers.smartTable.isLoading"><tr ng-repeat="row in Providers.smartTable.rowCollection" st-selected-row="row"><td ng-bind-html="row.name | highlight: globalSearch"></td><td ng-bind-html="row.descr | highlight: globalSearch"></td><td ng-bind-html="row.phone | highlight: globalSearch"></td><td ng-bind-html="row.address | highlight: globalSearch"></td><td><span class="dropdown" dropdown><i class="dropdown-toggle icon-menu3" dropdown-toggle></i><ul class="dropdown-menu grid-menu"><li><a href ng-click="Providers.on.editOptsClick(row)"><i class="icon-pencil"></i> <span>Edit</span></a></li><li><a href ng-click="Providers.on.deleteOptsClick(row)"><i class="icon-bin"></i> <span>Delete</span></a></li></ul></span></td></tr><tr ng-if="!Providers.smartTable.rowCollection.length"><td colspan="5" class="text-center"><span>No Providers found</span></td></tr></tbody><tbody ng-if="Providers.smartTable.isLoading"><tr><td colspan="5"><i class="icon-spinner10 grid-loader"></i></td></tr></tbody><tfoot ng-if="!Providers.smartTable.isLoading"><tr><td colspan="5"><div class="text-center" st-pagination="" st-items-by-page="Providers.smartTable.resultsPerPage"></div><small ng-if="Providers.smartTable.rowCollection.length" class="content-range text-center">{{Providers.smartTable.contentRange}}</small></td></tr></tfoot></table></div>');
}]);
})();
