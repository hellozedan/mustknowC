(function () {
  appControllers.controller('loginCtrl', function ($scope, $state,UserService, $timeout) {
    $scope.fbLogin = function () {
      console.log("fblogin")
      if (window.cordova) {
        UserService.FBlogin().then(function success(s) {
          window.localStorage['fbData'] = angular.toJson(s.authResponse);
          var fbData = s.authResponse;

          var user = {
            fbToken: fbData['accessToken']
          }
          console.log(fbData['accessToken']);
          UserService.CreateUser(user)
            .then(function (user) {
              console.log("create")
              window.localStorage['user'] = angular.toJson(user);
              var ref = new Firebase("https://mustknow.firebaseIO.com");

              ref.authWithCustomToken(user.fireToken, function (error, authData) {

                if (error) {
                  console.log("Login Failed!", error);
                } else {
                  console.log("subjects")

                  $state.go("tab.subjects");
                }
              });
              $state.go("tab.subjects");
            }, function (err) {
              console.log("Error ", err);
              alert("error")
            });
          //alert($scope.FbName)


        }, function error(msg) {
          console.log("Error while performing Facebook login", msg);
        })
      } else {
        var user = {
          fbToken: 'EAAZAMbMtmoBIBAHHzKvk8AewEB55ZAVYLLIr0ofhi6Eyhrnd6aHdOB1gQO3Im86QmqooFAZAHyj0uXAtwWOTXCnFRU6IvvhS4z7JZCZB12h8fTMsxr9JAZAHH40f2aqIodDXlbdIEMHHd6ZA3YHzrLm97jQh6VTha199Qst6u4ukO2mYvO4II5X8ZBTrVmT1yeIZD',
          notification_token: 'b95a00b4-96e0-41c6-9331-fa787a54291b'

        }

        UserService.CreateUser(user)
          .then(function (user) {
            window.localStorage['user'] = angular.toJson(user);
            var ref = new Firebase("https://mustknow.firebaseIO.com");

            ref.authWithCustomToken(user.fireToken, function (error, authData) {

              if (error) {
                console.log("Login Failed!", error);
              } else {
                $state.go("tab.subjects");
              }
            });
            $state.go("tab.subjects");
          }, function (err) {
          });
      }

    };

  });
})();
// End of facebook login controller.
