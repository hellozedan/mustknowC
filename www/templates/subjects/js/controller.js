appControllers.controller('subjectsCtrl', function ($scope, $ionicPlatform, $rootScope, $state,$interval, $stateParams, $timeout, SubjectService, EntityService, UserService, MessagesService,ConfigurationService) {
  $scope.isExpanded = true;
  $rootScope.isHeaderExpanded = false;
  $scope.subjects = [];
  SubjectService.GetCategories()
    .then(function (categories) {}, function (err) {
    });
  $ionicPlatform.ready(function () {
    if (window.cordova && typeof window.plugins.OneSignal != 'undefined' && !ConfigurationService.Notification_token()) {
      $timeout(function () {
        window.plugins.OneSignal.getIds(function (ids) {

          UserService.RegisterNotification(ids.userId)
            .then(function (userToken) {
              ConfigurationService.SetNotification_token(userToken);
            }, function (err) {
            });
        });
      }, 5000)
    }
  });

  $scope.checkUndreadMessage = function(){
    return MessagesService.checkUndreadMessage();
  }
  $scope.doRefresh=function(){
    $scope.$broadcast('scroll.refreshComplete');
    SubjectService.GetSubjects(false)
      .then(function (subjects) {
        $scope.subjects = subjects;
      }, function (err) {
      });
  }
  //var stopTime = $interval($scope.doRefresh, 10000);
  $scope.$on("$destroy", function() {
    if (stopTime) {
      $interval.cancel(stopTime);
    }
  });
  $scope.doRefresh();


  $scope.goToChat = function (subject) {

    var userName = subject.user.first_name + " " + subject.user.last_name;
    var messageDetails = {
      conversationId: subject.user._id + "-" + subject._id,
      userName: userName,
      subjectName: subject.title,
      fbPhotoUrl: subject.user.fbPhotoUrl
    }
    EntityService.setMessageDetails(messageDetails);
    $state.go('chat')
  }
  $scope.goToUserProfile = function (subject) {
    //
    //var userName = subject.user.first_name + " " + subject.user.last_name;
    //var messageDetails = {
    //  conversationId: subject.user._id + "-" + subject._id,
    //  userName: userName,
    //  subjectName: subject.title,
    //  fbPhotoUrl: subject.user.fbPhotoUrl
    //}
    //EntityService.setMessageDetails(messageDetails);
    $state.go('userProfile',{userId:subject.user._id,first_name:subject.user.first_name})
  }
  $scope.goToFilter=function(){
    $state.go('filter');
  }
  $scope.goToMessages=function(){
    $state.go('tab.messages');
  }
  $scope.goToAddSubject=function(){
    $state.go('addSubject');
  }

})
appControllers.controller('addSubjectCtrl', function ($scope, $state, SubjectService, $stateParams, $filter, $ionicHistory,ConfigurationService) {
  $scope.isExpanded=true;
  $scope.failed = false;
  // initialForm is the first activity in the controller.
  // It will initial all variable data and let the function works when page load.
  $scope.subject = {};
  $scope.categories = [];

  $scope.initialForm = function () {

    $scope.subject = {
      title: '',
      user: ConfigurationService.UserDetails()._id,
      description: '',
      categories:[]
    }
    SubjectService.GetAddSubjectCategories()
      .then(function (categories) {
        $scope.categories = categories;
      }, function (err) {
      });

    $scope.actionDelete = $stateParams.actionDelete;


  };// End initialForm.

  $scope.createSubject = function () {
    if($scope.subject.title.length <= 0 || $scope.subject.description.length <= 0){
      $scope.failed = true;
      return;
    }


    $scope.subject.categories=[];
    for (var i = 0; i < $scope.categories.length; i++) {
      if ($scope.categories[i].is_selected) {
        $scope.subject.categories.push($scope.categories[i]._id);
      }
    }
    SubjectService.CreateSubject($scope.subject)
      .then(function () {
        $state.go("app.subjects");
      }, function (err) {
      });
  }



  $scope.initialForm();
});// End of Notes Detail Page  Controller.
appControllers.controller('filterCtrl', function ($scope,$state, $stateParams, $filter, $mdBottomSheet, $ionicHistory,SubjectService,ConfigurationService) {

  $scope.saveFilter = function () {
    $scope.myFilter.categories=[];
    angular.forEach($scope.categories, function (value, key) {
      if (value.is_selected) {
        $scope.myFilter.categories.push(value._id)
      }
    });
    ConfigurationService.SetMyFilter( $scope.myFilter);
    $state.go('app.subjects');
    //$state.go('app.subjects', {}, {reload: true});
    //$state.go('app.subjects');

  }
  // initialForm is the first activity in the controller.
  // It will initial all variable data and let the function works when page load.
  $scope.initialForm = function () {
    SubjectService.GetCategories()
      .then(function (categories) {
        $scope.categories = categories;
        for(var i=0;i<$scope.categories.length;i++){
          if($scope.myFilter.categories.indexOf($scope.categories[i]._id)!==-1)
          {
            $scope.categories[i].is_selected=true;
          }
        }
      }, function (err) {
      });

    $scope.myFilter = ConfigurationService.MyFilter();
    if (!$scope.myFilter.gender) {
      $scope.myFilter = {
        nearMe: false,
        gender: 'both',
        categories: []
      }
      ConfigurationService.SetMyFilter($scope.myFilter);
    }

  };// End initialForm.
  $scope.initialForm();
});// End of Notes Detail Page  Controller.

