// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment', 'ngCordova', 'firebase'])

.run(function($ionicPlatform, $state, ConfigurationService, UserService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
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

            var ref = new Firebase("https://chatoi.firebaseio.com");

            ref.authWithCustomToken(user.fireToken, function (error, authData) {

              if (error) {
                console.log("Login Failed!", error);
              } else {
                if(isNotificationClicked)
                  $state.go("tab.chat");
                else
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

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
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

  .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'templates/messages/html/messages.html',
          controller: 'messagesCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
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
  $urlRouterProvider.otherwise('/tab/dash');

});
