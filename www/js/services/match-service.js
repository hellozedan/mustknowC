(function(){
  appServices.factory('MatchService', function ($http, $q, ConfigurationService) {
    return {
      Match: function (match) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users/match',
          match,
          {
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
      GetMySubjects: function (userId, status) {
        var deferred = $q.defer();
        if (userId == undefined) {
          userId = null;
        }
        tryPost();
        function tryPost() {
          $http.post(ConfigurationService.ServerUrl() + '/api/subjects/filter?userSubjects=true&status='+status + '&userId=' + userId, {}, {
            headers: {
              "access-token": ConfigurationService.UserDetails().token
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            //   $log.error(msg, code);
          });
        }

        return deferred.promise;
      },
      Interested: function (subjectId) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects/interested', {subjectId:subjectId}, {
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
      ChangeStatus: function (subject,status) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects/status', {
          _id: subject._id,
          status: status
        }, {
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
      CreateSubject: function (subject) {
        var deferred = $q.defer();
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            subject.locationCoords = [lat, long];
            tryPost();
          }, function (err) {
            subject.locationCoords = [];
            tryPost();
            // error
          });
        function tryPost() {

          $http.post(ConfigurationService.ServerUrl() + '/api/subjects',
            subject
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
        }

        return deferred.promise;
      },
      DeleteSubjects: function (subject) {
        var deferred = $q.defer();
        $http.delete(ConfigurationService.ServerUrl() + '/api/subjects?_id=' + subject._id, {
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
      UpdateSubject: function (subject) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects',subject, {
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

