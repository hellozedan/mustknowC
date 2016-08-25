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
          UserService.CreateUser(user)
            .then(function (user) {
              console.log("create")
              window.localStorage['user'] = angular.toJson(user);
              var ref = new Firebase("https://chatoi.firebaseio.com");

              ref.authWithCustomToken(user.fireToken, function (error, authData) {

                if (error) {
                  console.log("Login Failed!", error);
                } else {
                  console.log("subjects")

                  $state.go("app.subjects");
                }
              });
              $state.go("tab.subjects");
            }, function (err) {
            });
          //alert($scope.FbName)


        }, function error(msg) {
          console.log("Error while performing Facebook login", msg);
        })
      } else {
        var user = {
          fbToken: 'EAAZAMbMtmoBIBALj5DyX7bu71nOEseTibvVBgQ2ppXJUdyHL2SZAsGNkuTQbWfD6zGCfvFruIGaZCNUJ2fnlZClNfStiDzKeUIRPtzW3SOcdluFh0BB4bqYaZAc1yIivznqC9jvaBuKMTZAu4JsAOmxXdfIs5CGsDZBx0ExkT5vwBfvHWOzGAZAXQqioNX9Pagx1FLeQYVUSiXtiR74UDBlT',
          notification_token: 'b95a00b4-96e0-41c6-9331-fa787a54291b'

        }

        UserService.CreateUser(user)
          .then(function (user) {
            window.localStorage['user'] = angular.toJson(user);
            var ref = new Firebase("https://chatoi.firebaseio.com");

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
