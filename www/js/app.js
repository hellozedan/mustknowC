(function(){
  angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment', 'ngCordova', 'firebase'])

    .run(function($ionicPlatform, $state, ConfigurationService, UserService, EntityService) {
      $ionicPlatform.on('pause', function() {
        Firebase.goOffline();

      });
      $ionicPlatform.on('resume', function() {
        Firebase.goOnline();

      });
      $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          setTimeout(function() {
            navigator.splashscreen.hide();
          }, 50);
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
        var isNotificationClicked = false;
        if(window.cordova && typeof window.plugins.OneSignal != 'undefined'){
          var notificationOpenedCallback = function (jsonData) {

            var messageDetails = {
              conversationId: jsonData.additionalData.conversationId,
              userName: jsonData.additionalData.userName,
              subjectName: jsonData.additionalData.subjectName,
              fbPhotoUrl: jsonData.additionalData.fbPhotoUrl
            }
            isNotificationClicked = true;
            EntityService.setMessageDetails(messageDetails);
            $state.go("chat");


          };
          window.plugins.OneSignal.init("ee6f85c1-a2ff-4d1b-9fa6-29dd4cc306ef",
            { googleProjectNumber: "238478083352" },
            notificationOpenedCallback);
          window.plugins.OneSignal.enableNotificationsWhenActive(false);
        }

        var user = ConfigurationService.UserDetails();
        if (user) {
          UserService.CheckUser()
            .then(function (user) {
              if(user.isNeedLogin === false){

                var ref = new Firebase("https://mustknow.firebaseIO.com");

                ref.authWithCustomToken(user.fireToken, function (error, authData) {

                  if (error) {
                    console.log("Login Failed!", error);
                  } else {
                    if(!isNotificationClicked)
                      $state.go("tab.subjects");
                  }
                });
              }
              else{
                $state.go("login");
              }
            }, function (err) {
              $state.go("login");
            });
        }else{
          $state.go("login");
        }

      });
    })
    .factory('focus', function($timeout, $window) {
      return function(id) {
        // timeout makes sure that is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or
        // inputs elements that are in a disabled state but are enabled when those events
        // are triggered.
        $timeout(function() {
          var element = $window.document.getElementById(id);
          if(element)
            element.focus();
        });
      };
    })

    .directive('eventFocus', function(focus) {
      return function(scope, elem, attr) {
        elem.on(attr.eventFocus, function() {
          focus(attr.eventFocusId);
        });

        // Removes bound events in the element itself
        // when the scope is destroyed
        scope.$on('$destroy', function() {
          element.off(attr.eventFocus);
        });
      };
    })

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs/html/tabs.html'
        })
        .state('login', {
          url: "/login",
          templateUrl: "templates/login/html/login.html",
          controller: "loginCtrl"

        })
        .state('chat', {
          url: "/chat",
          templateUrl: "templates/chat/html/chat.html",
          controller: "chatCtrl"

        })
        .state('userProfile', {
          url: "/userProfile/:userId/:first_name",
          templateUrl: "templates/profile/html/userProfile.html",
          controller: "userProfileCtrl"
        })
        .state('blockedUsers', {
          url: "/blockedUsers",
          templateUrl: "templates/blockedUsers/html/blockedUsers.html",
          controller: "blockedUsersCtrl"
        })

        // Each tab has its own nav history stack:

        .state('tab.subjects', {
          url: '/subjects',
          views: {
            'tab-subjects': {
              templateUrl: 'templates/subjects/html/subjects.html',
              controller: 'subjectsCtrl'
            }
          }
        })
        .state('tab.addSubject-s1', {
          url: "/addSubject-s1",
          views: {
            'tab-addSubject': {
              templateUrl: "templates/subjects/html/addSubject-s1.html",
              controller: 'addSubjectCtrl'
            }
          }
        })
        .state('tab.addSubject-s2', {
          url: "/addSubject-s2/:categoryId",
          views: {
            'tab-addSubject': {
              templateUrl: "templates/subjects/html/addSubject-s2.html",
              controller: 'addSubjectCtrl'
            }
          }
        })
        .state('tab.messages', {
          url: '/messages',
          views: {
            'tab-messages': {
              templateUrl: 'templates/messages/html/messages.html',
              controller: 'messagesCtrl'
            }
          }
        })


        .state('tab.myProfile', {
          url: '/myProfile',
          views: {
            'tab-myProfile': {
              templateUrl: 'templates/profile/html/myProfile.html',
              controller: 'myProfileCtrl'
            }
          }
        });

      // if none of the above states are matched, use this as the fallback


    });
})();

