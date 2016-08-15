// Controller of expense dashboard page.
appControllers.controller('myProfileCtrl', function ($rootScope, $scope,$state,$stateParams,EntityService,SubjectService,ConfigurationService) {
  SubjectService.GetCategories()
    .then(function (categories) {}, function (err) {
    });
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = false;
  $scope.isAnimated =  $stateParams.isAnimated;
  $scope.userProfile = ConfigurationService.UserDetails();// angular.fromJson(window.localStorage['user']);
  $scope.subjects = [];
  $scope.deleteSubject = function (subject) {
    EntityService.deleteFromArray($scope.subjects, subject)
    SubjectService.DeleteSubjects(subject)
      .then(function () {

      }, function (err) {
      });
  }
  $scope.goToAddSubject=function(){
    $state.go('app.addSubject');
  }
  $scope.displayDelete = true;
  SubjectService.GetMySubjects($scope.userProfile._id)
    .then(function (subjects) {
      $scope.subjects = subjects;
    }, function (err) {
    });
  // doSomeThing is for do something when user click on a button
  $scope.doSomeThing = function () {
    // You can put any function here.
  } // End doSomeThing.


  $scope.goToSetting = function () {
    $state.go("app.expenseSetting");
  };

});

appControllers.controller('userProfileCtrl', function ($rootScope, $scope,$state,$stateParams,EntityService,SubjectService,UserService) {
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = false;
  $scope.userProfile = UserService.GetUserProfile();
  $scope.first_name = $scope.userProfile.first_name;

  $scope.a=function(){
    $state.go('app.subjects');
  }
  $scope.isAnimated =  $stateParams.isAnimated;
  //$scope.userProfile = angular.fromJson(window.localStorage['user']);
  $scope.subjects = [];
  SubjectService.GetMySubjects($scope.userProfile.userId)
    .then(function (subjects) {
      $scope.subjects = subjects;
    }, function (err) {
    });


  $scope.goToSetting = function () {
    $state.go("app.expenseSetting");
  };

});


appControllers.controller('profileSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

  $scope.navigateTo = function (stateName,objectData) {
    if ($ionicHistory.currentStateName() != stateName) {
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });

      //Next view animate will display in back direction
      $ionicViewSwitcher.nextDirection('back');

      $state.go(stateName, {
        isAnimated: objectData,
      });
    }
  }; // End of navigateTo.
}); // End of controller expense dashboard setting.
