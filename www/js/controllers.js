var appControllers = angular.module('starter.controllers', []);
var appServices = angular.module('starter.services', []);

appControllers.controller('AppCtrl', function ($scope, $ionicHistory) {

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
});

appControllers.controller('NewMessagesCtrl', function ($scope, MessagesService) {

  $scope.checkUndreadMessage = function(){

    return MessagesService.checkUndreadMessage();
  }
});

appControllers.controller('tabsCtrl', function ($scope, $state) {

  $scope.addSubject = function(){
    $state.go('addSubject');

  }
});
