(function () {
  appServices.factory('UserService', function ($http, $log, $q, $cordovaFacebook, ConfigurationService) {
    var userProfile = {};
    return {
      AuthPhone: function(phoneNumber){
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users',
          {phone_number: phoneNumber}
          , {
            headers: {
              "Content-Type": "application/json"
            }
          }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      AuthConfirm: function(confirm){
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users/confirm',
          confirm
          , {
            headers: {
              "Content-Type": "application/json",
              "access-token": ConfigurationService.UserDetails().token
            }
          }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      AuthFbLogin: function (fb) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users/facebookLogin',
          fb
          , {
            headers: {
              "Content-Type": "application/json",
              "access-token": ConfigurationService.UserDetails().token
            }
          }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
        return deferred.promise;
      },
      LogOut: function () {
        var deferred = $q.defer();

        $http.get(ConfigurationService.ServerUrl() + '/api/users/logOut', {
          headers: {
            "Content-Type": "application/json",
            "access-token": ConfigurationService.UserDetails().token
          }
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
        return deferred.promise;
      },
      GetUser: function (userId) {
        var deferred = $q.defer();
        $http.get(ConfigurationService.ServerUrl() + '/api/users/' + userId, {
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
      },
      CheckUser: function (userId) {
        var deferred = $q.defer();
        $http.get(ConfigurationService.ServerUrl() + '/api/users', {
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
      },
      FBlogin: function () {
        var deferred = $q.defer();
        $cordovaFacebook.login(["public_profile", "email", "user_friends", "user_birthday"]).then(
          function success(result) {
            deferred.resolve(result);
          },
          function error(reason) {
            alert(JSON.stringify(reason))
            deferred.reject(reason);
          }
        );
        return deferred.promise;
      },
      RegisterNotification: function (token) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users/notification',
          {
            "notification_token": token
          },
          {
            headers: {
              "access-token": ConfigurationService.UserDetails().token
            }
          }
        ).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
        return deferred.promise;
      },
      SetUserProfile: function (message) {
        var createrId = message.conversationId.split("-")[0];
        userProfile.userId = createrId;
        userProfile.first_name = message.userName;

        userProfile.fbPhotoUrl = message.fbPhotoUrl;
      },
      GetUserProfile: function () {
        return userProfile;
      }
    }
  });
})();
