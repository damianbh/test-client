angular.module('testClientGulp')
  .service('config', function ($q, $http) {
    'use strict';

    var
      self = this;

    self.$promise = $http.get('/assets/config.json').then(function (resp) {
      _.extend(self, resp.data);
      return self;
    });

  });


//, deferred = $q.defer(),
//oReq = new XMLHttpRequest();
//self.$promise = deferred.promise;
//
//function reqListener() {
//  if (oReq.status === 200) {
//    _.extend(self, angular.fromJson(this.responseText));
//    deferred.resolve(self);
//  } else {
//    deferred.reject('Error Loading System Configuration');
//  }
//
//}

//function errorListener() {
//  deferred.reject('Error Loading System Configuration');
//}

//oReq.addEventListener('error', errorListener, false);
//oReq.addEventListener('load', reqListener, false);
//oReq.open("get", "/assets/config.json", true);
//oReq.send();
