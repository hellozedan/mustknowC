(function () {
appControllers.controller('messagesCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $firebaseArray, ConfigurationService, MessagesService, UserService, EntityService) {

  $scope.$on('sendMessagesEvent', function(event, mass) {
    $scope.messages = MessagesService.getMessages();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
  MessagesService.setMessages();
  $scope.goToChat = function (message) {
    var messageDetails = {
      conversationId: message.conversationId,
      fbPhotoUrl: message.fbPhotoUrl,
      userName: message.userName,
      subjectName: message.subjectName,
      desc:message.desc
    }
    EntityService.setMessageDetails(messageDetails);
    $state.go('chat', {conversationId: message.conversationId})
  }

  $scope.goToUserProfile = function (message) {
    UserService.SetUserProfile(message);
    $state.go('userProfile')

  }
});
})();

