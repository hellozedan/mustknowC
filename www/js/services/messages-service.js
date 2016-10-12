(function () {
  appServices.factory('MessagesService', function ($rootScope, $ionicScrollDelegate, $firebaseObject, ConfigurationService) {
    var messages = [];
    var userDetails = ConfigurationService.UserDetails();

    var fillMessages = function () {

      if(!userDetails)
        return;
      var ref = new Firebase(ConfigurationService.FireBaseUrl() + "/chats/" + userDetails._id);
      ref.orderByValue().on("value", function (snapshot) {
        messages = [];
        angular.forEach(snapshot.val(), function (value, key) {

          var conversationId = key;

          if (value.messages) {
            var messagesArray = Object.getOwnPropertyNames(value.messages);
            var lastMessageKey = messagesArray[messagesArray.length - 1];
            var lastMessage = value.messages[lastMessageKey].body;
            var createrId = conversationId.split("-")[0];

            var readMessage = false;
            if (value.read) {
              readMessage = value.read;
            }


            var indexx = common.indexOfConv(messages, conversationId);
            var msg = {
              conversationId: conversationId,
              lastMessage: lastMessage,
              lastMessageKey: lastMessageKey,
              subjectName: value.subjectName,
              fbPhotoUrl: value.fbPhotoUrl,
              userName: value.userName,
              readMessage: readMessage,
              desc:value.desc

            }

            if (indexx === -1) {
              messages.push(msg);
            }
            else {
              messages[indexx] = msg;

            }
            var userRef = new Firebase(ConfigurationService.FireBaseUrl() + '/presence/' + createrId);
            userRef.on("value", function (userSnapshot) {
              var online = true;
              if (userSnapshot.val() == 'offline') {
                online = false;

              }
              var blockedUrl = ConfigurationService.FireBaseUrl() + "/chats/" + createrId + "/blocked/" + userDetails._id;
              var blockedRef = new Firebase(blockedUrl);
              var blockUser = $firebaseObject(blockedRef);
              blockUser.$loaded(function (value) {
                if (value.userId) {
                  online = false;
                }
                var indexx = common.indexOfConv(messages, conversationId);

                messages[indexx].online = online
                $rootScope.$broadcast('sendMessagesEvent', 'sendMessagesEvent');
              })


            });
          }

        });
      });
    }
    fillMessages();
    return {
      getMessages: function () {
        return messages;
      },
      setMessages: function () {
        fillMessages();
      },
      checkUndreadMessage: function () {
        for (var i = 0; i < messages.length; i++) {
          if (messages[i].readMessage === false) {
            return true;
          }
        }
        return false;
      }
    }
  })
})();
