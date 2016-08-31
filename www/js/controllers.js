var appControllers = angular.module('starter.controllers', []);
var appServices = angular.module('starter.services', []);

appControllers.controller('NewMessagesCtrl', function ($scope, MessagesService) {

  $scope.checkUndreadMessage = function(){

    return MessagesService.checkUndreadMessage();
  }
});

appControllers.controller('tabsCtrl', function ($scope, MessagesService) {

  $scope.checkUndreadMessage = function(){

    return MessagesService.checkUndreadMessage();
  }
});
appControllers.controller('AppCtrl', function ($scope, $state, $ionicHistory) {

  $scope.goBack = function(){
    if($state.current.name.indexOf('chat') >= 0){
      $state.go('tab.messages');
    }else{
      $ionicHistory.goBack();
    }

  }
});

