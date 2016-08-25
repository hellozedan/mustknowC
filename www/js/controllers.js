var appControllers = angular.module('starter.controllers', []);
var appServices = angular.module('starter.services', []);

appControllers.controller('NewMessagesCtrl', function ($scope, MessagesService) {

  $scope.checkUndreadMessage = function(){

    return MessagesService.checkUndreadMessage();
  }
});

appControllers.controller('tabsCtrl', function ($scope) {

  $scope.addSubject = function(){


  }
});
appControllers.controller('AppCtrl', function ($scope, $ionicHistory) {

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
});

