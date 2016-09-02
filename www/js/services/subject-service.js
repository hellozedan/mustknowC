(function(){
  appServices.factory('SubjectService', function ($http, $log, $q, ConfigurationService, $cordovaGeolocation) {
    return {
      TimeToUpdateFromServer:1000*60*15,
      GetCategories: function () {
        var deferred = $q.defer();
        if((!ConfigurationService.categories)||(ConfigurationService.categories.datetime&&((new Date()).getTime()-ConfigurationService.categories.datetime.getTime())>this.TimeToUpdateFromServer)) {
          $http.get(ConfigurationService.ServerUrl() + '/api/subjects/categories', {
            headers: {
              "access-token": ConfigurationService.UserDetails().token
            }
          }).success(function (data) {
            ConfigurationService.categories = {
              data: data,
              datetime: new Date()
            }
            deferred.resolve(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            //   $log.error(msg, code);
          });
        }
        else
        {
          deferred.resolve(ConfigurationService.categories.data);

        }
        return deferred.promise;
      },
      GetSubjects: function (userSubjects,scrollOptions, userId) {
        var deferred = $q.defer();
        if (userId == undefined) {
          userId = null;
        }
        var myFilter = ConfigurationService.MyFilter();
        myFilter.limit = scrollOptions.limit;
        myFilter.skip = scrollOptions.skip;
        if (!myFilter.gender) {
          myFilter = {
            nearMe: false,
            gender: 'both',
            categories: []
          }
          ConfigurationService.SetMyFilter(myFilter);
        }
        if (myFilter.nearMe) {
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
              var lat = position.coords.latitude;
              var long = position.coords.longitude;
              myFilter.locationCoords = [lat, long];
              tryPost();
            }, function (err) {
              myFilter.locationCoords = [];
              tryPost();
              // error
            });
        }
        else {
          myFilter.locationCoords = [];
          tryPost();
        }
        // myFilter.categories = Object.keys(myFilter.categories);
        function tryPost() {
          $http.post(ConfigurationService.ServerUrl() + '/api/subjects/filter?userSubjects=' + userSubjects + '&userId=' + userId, myFilter, {
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

