(function () {
appServices.factory('NotificationService', function ($http, $log, $q, ConfigurationService) {
  return {

    SendMessage: function (message) {
      var deferred = $q.defer();
      $http.post(ConfigurationService.ServerUrl() + '/api/notification',
        message
        , {
          headers: {
            "access-token": ConfigurationService.UserDetails().token
          }
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
      return deferred.promise;
    }
  }
})
})();
