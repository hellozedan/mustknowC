(function () {
  appControllers.controller('blockedUsersCtrl', function ($scope, $rootScope,$state,$ionicPopup, $stateParams, $filter,$firebaseArray, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory,SubjectService,ConfigurationService,Firebase) {
    $scope.isExpanded = true;
    $rootScope.isHeaderExpanded = true;
    $scope.showConfirm = function(blockedUser) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Unblock User',
        template: 'Are you sure you want to remove'+ blockedUser.userName+' from your blocked users?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var blockedUserRef=new Firebase("https://mustknow.firebaseIO.com/chats/" + $scope.userDetails._id+"/blocked/"+blockedUser.userId);
          blockedUserRef.remove();
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };
    $scope.userDetails = ConfigurationService.UserDetails();
    // initialForm is the first activity in the controller.
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
      var blockedUsersRef=new Firebase("https://mustknow.firebaseIO.com/chats/" + $scope.userDetails._id+"/blocked/");
      $scope.blockedUsers=$firebaseArray(blockedUsersRef);
    };// End initialForm.
    $scope.initialForm();
  });
})();// End of Notes Detail Page  Controller.

