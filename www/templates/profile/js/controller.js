
(function () {
// Controller of expense dashboard page.
appControllers.controller('myProfileCtrl', function ($rootScope, $ionicPopup,UserService, $firebaseArray, $ionicLoading, $scope,$state,$stateParams,$ionicHistory,EntityService,SubjectService,ConfigurationService) {

  $scope.userProfile = ConfigurationService.UserDetails();// angular.fromJson(window.localStorage['user']);
  $scope.categoriesUrl = ConfigurationService.CategoriesUrl();
  $scope.subjects = [];
  $scope.deleteSubject = function (index, subject) {
    $scope.subjects.splice(index, 1);
    SubjectService.DeleteSubjects(subject)
      .then(function () {

      }, function (err) {
      });
  }

  $scope.logOut = function(){
    UserService.LogOut()
      .then(function () {
        window.localStorage.clear();
        ConfigurationService.LogOut();
        $ionicHistory.clearHistory();
        $state.go('login');
      }, function (err) {
        $state.go('login');
      });
  }

  $scope.tab = 'open';
  $scope.updateProfile=function () {
    var user = {
      fbToken:$scope.userProfile.fbToken
    }
    UserService.CreateUser(user)
      .then(function (user) {
        window.localStorage['user'] = angular.toJson(user);
        $scope.userProfile=ConfigurationService.RefreshUserDetails();
      }, function (err) {
        console.log("Error ", err);
      });
  }
  $scope.getSubjects = function(title){
    $scope.tab = title;
    $scope.subjects = [];
    $ionicLoading.show();

    if(title == 'open'){
      SubjectService.GetMySubjects($scope.userProfile._id, true)
        .then(function (subjects) {
          $scope.subjects = subjects.subjects;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
        });
    }else if(title == 'closed'){
      SubjectService.GetMySubjects($scope.userProfile._id, false)
        .then(function (subjects) {
          $scope.subjects = subjects.subjects;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
        });
    }else if(title == 'blocked'){
      var blockedUsersRef = new Firebase("https://chatoi.firebaseio.com/chats/" + $scope.userDetails._id+"/blocked/");
      $scope.blockedUsers = $firebaseArray(blockedUsersRef);
      $ionicLoading.hide();
    }
  }
  $scope.changeStatus = function(subject, index, status){
    $scope.subjects.splice(index,1);
    SubjectService.ChangeStatus(subject,status)
      .then(function (subjects) {

      }, function (err) {
      });
  }
  $scope.getSubjects('open');

  $scope.showConfirm = function(blockedUser) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Unblock User',
      template: 'Are you sure you want to remove'+ blockedUser.userName+' from your blocked users?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var blockedUserRef=new Firebase("https://chatoi.firebaseio.com/chats/" + $scope.userDetails._id+"/blocked/"+blockedUser.userId);
        blockedUserRef.remove();
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };
  $scope.userDetails = ConfigurationService.UserDetails();

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
})();
