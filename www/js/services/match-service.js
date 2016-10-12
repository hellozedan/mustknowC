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

        });


        return deferred.promise;
      },
      SendMessageToMatcher: function (matchDetails){
        angular.forEach(matchDetails.otherPersons, function(value, key){

          var conversaionId = value._id + "-" + matchDetails.match_id;
          var firebaseMainRef = new Firebase(ConfigurationService.FireBaseUrl() + '/chats/' + matchDetails.mainPerson._id + '/' + conversaionId + "/messages");
          var date = new Date();
          var msg = "hello";
          var msgTosend = {
            body: msg,
            sender: value._id,
            create_date: date.toJSON(),
            date_string: date.toLocaleDateString()
          }
          var refToPush = firebaseMainRef.push();
          refToPush.set(msgTosend);

          conversaionId = matchDetails.mainPerson._id + "-"  + matchDetails.match_id;
          firebaseMainRef = new Firebase(ConfigurationService.FireBaseUrl() + '/chats/' + value._id + '/' + conversaionId + "/messages");
          msgTosend.sender = matchDetails.mainPerson._id;
          refToPush = firebaseMainRef.push();
          refToPush.set(msgTosend);
          console.log(value);
        });
      }

    }
  })
})();

