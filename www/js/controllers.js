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
      if($ionicHistory.backView()){
        $ionicHistory.goBack();
      }else{
        $state.go('tab.messages');
      }
    }else{
      $ionicHistory.goBack();
    }

  }
});

appServices.factory('favoriteService', ['$state','$rootScope','$ionicPlatform','$ionicHistory',function($state,$ionicPlatform,$ionicHistory,$timeout){
  var favorites = [];
  return {
    getFavorites : function () {
      if (favorites.length > 0){
        return favorites;
      }
      else {
        favorites =  angular.fromJson(window.localStorage['favorites']) || [];
        return favorites;
      }
    },
    addToFavorites : function (fav) {
      favorites.push(fav);
      window.localStorage['favorites'] = angular.toJson(favorites);
    }
  };
/*  $scope.addToFavorites = function () {
    var fav = {
      subject: $scope.subject.id
    };
    window.localStorage['favorites'] = angular.toJson(fav);
  };*/
}]);

appServices.factory('backcallFactory', ['$state','$rootScope','$ionicPlatform','$ionicHistory','$timeout',function($state,$rootScope,$ionicPlatform,$ionicHistory,$timeout){
  var obj={};
  obj.backCall=function(){
    var backbutton=0;
    $ionicPlatform.registerBackButtonAction(function () {
      if ($state.current.name === 'tab.subjects' || $state.current.name === 'tab.addSubject-s1' || $state.current.name === 'tab.messages' || $state.current.name === 'tab.myProfile' || $state.current.name === 'login') {
        if(backbutton==0){
          backbutton++;
          window.plugins.toast.showShortBottom('press back button again to exit.');
          $timeout(function(){backbutton=0;},3000);
        }else{
          navigator.app.exitApp();
        }
      }
      else if($state.current.name.indexOf('chat') >= 0){
        $state.go('tab.messages');
      }
      else if ($ionicHistory.viewHistory().backView != null){
        $ionicHistory.goBack();
      }
      else if($rootScope.TabName){
        $state.go($rootScope.TabName);
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }else{
        $state.go('tab.subjects');
      }
    }, 100);//registerBackButton
  }//backcallfun
  return obj;
}]);



