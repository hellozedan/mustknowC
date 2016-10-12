(function () {
  appControllers.controller('matchCtrl', function($scope, $cordovaContacts, MatchService){
    $scope.selectedPersons = {};
    $scope.mainPerson = {};
    $scope.otherPersons = []
    $scope.selectPerson = function(person, index){
      if(window.cordova){
        $cordovaContacts.pickContact().then(function (contact) {
          var flSplit =  contact.displayName.split(' ');

          if(flSplit .length > 0){
            var firstname = flSplit[0][0];
            var lastname = (flSplit.length >= 2) ? flSplit[1][0]: ""
            var fl = firstname + lastname;
            contact.fl = fl;
          }
          contact.phoneNumbers[0].value = contact.phoneNumbers[0].value.replace(/[\-]+/g, '');
          contact.index = index;
          if(person == 'mainPerson'){
            //alert(JSON.stringify(contact))
            $scope.mainPerson = {
              phone_number : contact.phoneNumbers[0].value,
              contactName: contact.displayName
            }
          }
          $scope.selectedPersons[person] = contact;

        });
      }else{
        if(person == 'mainPerson'){
          var contact = {
            displayName: "obaida abo elhija",
            name: {
              familyName: "abo elhija",
              givenName: "obaida"
            },
            phoneNumbers: [
              {
                id: "1234",
                value: "052-886-9555"
              }
            ]
          }
        }else{
          var contact = {
            displayName: "ahmed zedany",
            name: {
              familyName: "abo zedany",
              givenName: "ahmed"
            },
            phoneNumbers: [
              {
                id: "1234",
                value: "052-111-1111"
              }
            ]
          }
        }
        contact.phoneNumbers[0].value = contact.phoneNumbers[0].value.replace(/[\-]+/g, '');

        var flSplit =  contact.displayName.split(' ');

        if(flSplit .length > 0){
          var firstname = flSplit[0][0];
          var lastname = (flSplit.length >= 2) ? flSplit[1][0]: ""
          var fl = firstname + lastname;
          contact.fl = fl;
        }
        contact.index = index;
        if(person == 'mainPerson'){

          $scope.mainPerson = {
            phone_number : contact.phoneNumbers[0].value,
            contactName: contact.displayName
          }

        }
        $scope.selectedPersons[person] =contact;
        //if (!$scope.$$phase) $scope.$apply()
      }


    }
    $scope.match = function(){
      $scope.otherPersons = [];
      angular.forEach($scope.selectedPersons, function(value, key){
        if(value.index != 0){
          var otherP = {
            phone_number : value.phoneNumbers[0].value,
            contactName: value.displayName,
            index: value.index
          }
          $scope.otherPersons.push(otherP);
        }

      });
      $scope.otherPersons.sort(function(a,b){
        return a.index - b.index;
      });
      var match = {
        mainPerson: $scope.mainPerson,
        otherPersons: $scope.otherPersons
      }
      MatchService.Match(match).then(function(match){
          console.log(match);
          MatchService.SendMessageToMatcher(match);
      },
        function(err){

        }
      )
    }

  });
  appControllers.controller('subjectsCtrl', function ($scope, $cordovaContacts, MessagesService,$ionicScrollDelegate, $ionicModal, $ionicPlatform, $rootScope, $state, $interval, $stateParams, $timeout, SubjectService, EntityService, UserService, MessagesService, ConfigurationService, backcallFactory) {


    $scope.scrollOptions = {
      skip: 0,
      limit: 20
    }
    function removeChatSubjects(messages){
      $scope.messagesMap = {};
      angular.forEach(messages, function(message){
        var subjectId = message.conversationId.split('-')[1];
        $scope.messagesMap[subjectId] = true;
      })
      angular.forEach($scope.subjects, function(subject, key){
        if($scope.messagesMap[subject._id]){
          console.log("s");
          $scope.subjects.splice(1,key);
        }

      })
    }
    function loadSubjects(callback){
      SubjectService.GetSubjects(false, $scope.scrollOptions)
        .then(function (subjects) {
          var s = [];
          angular.forEach(subjects.subjects, function(subject){
           s.push(subject);
          })
          $scope.subjectsCount = subjects.count;
          callback(s);


        }, function (err) {
        });
    }

    $scope.loadOlderSubjects = function(){
      if($scope.subjects.length>0 ){
        $scope.scrollOptions.skip = $scope.subjects.length;
        $scope.scrollOptions.limit = 20;
      }

      loadSubjects(function(subjects){
        $scope.subjects = $scope.subjects.concat(subjects);
        $scope.$broadcast('scroll.infiniteScrollComplete');

      })


    }
    $scope.moreDataCanBeLoaded =function(){
      if($scope.subjects.length >= $scope.subjectsCount){
        return false;
      }
      return true;
    }
    $scope.loadNewrSubjects = function(){
      $scope.scrollOptions = {
        skip: 0,
        limit: 20
      }
      loadSubjects(function(subjects){
        $scope.subjects = [];
        $scope.subjects = $scope.subjects.concat(subjects);
        $scope.$broadcast('scroll.refreshComplete');
      })
    }
    $scope.subjects = [];
    SubjectService.GetCategories()
      .then(function (categories) {
      }, function (err) {
      });
    $ionicPlatform.ready(function () {
      //doRefresh();
      backcallFactory.backCall();
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
      $scope.userDetails = ConfigurationService.UserDetails();
      if($scope.userDetails){
        var amOnline = new Firebase('https://mustknow.firebaseIO.com/.info/connected');
        var userRef = new Firebase('https://mustknow.firebaseIO.com/presence/' + $scope.userDetails._id);
        var conversationUserRef = new Firebase('https://mustknow.firebaseIO.com/conversationOnline/' + $scope.userDetails._id);
        amOnline.on('value', function(snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().set('offline');
            conversationUserRef.onDisconnect().remove();
            userRef.set('online');
          }
        });
      }
    });

    $scope.checkUndreadMessage = function () {
      return MessagesService.checkUndreadMessage();
    }
    function doRefresh() {
      SubjectService.GetSubjects(false, $scope.scrollOptions)
        .then(function (subjects) {
          $scope.subjects = subjects.subjects;
          //MessagesService.setMessages();
          $scope.subjectsCount = subjects.count;
        }, function (err) {
        });
    }



    $scope.goToChat = function (subject) {

      var userName = subject.user.first_name + " " + subject.user.last_name;
      var messageDetails = {
        conversationId: subject.user._id + "-" + subject._id,
        userName: userName,
        subjectName: subject.title,
        fbPhotoUrl: subject.user.fbPhotoUrl,
        desc:subject.description
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
      $state.go('userProfile', {userId: subject.user._id, first_name: subject.user.first_name})
    }
    $scope.goToFilter = function () {

    }
    $scope.goToMessages = function () {
      $state.go('tab.messages');
    }
    $scope.goToAddSubject = function () {
      $state.go('addSubject');
    }

    $ionicModal.fromTemplateUrl('templates/match/html/select-contact.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      console.log("$destroy")
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      console.log("modal hiden");
      $rootScope.myFilter.categories = [];
      $scope.scrollOptions = {
        skip: 0,
        limit: 20
      }
      SubjectService.GetCategories()
        .then(function (categories) {
          $scope.categories = categories;
          angular.forEach($scope.categories, function (value, key) {
            if (value.is_selected) {
              $rootScope.myFilter.categories.push(value._id)
            }
          });
          ConfigurationService.SetMyFilter($rootScope.myFilter);
          doRefresh();
        }, function (err) {
        });

    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      console.log("removed");
    });
  })
  appControllers.controller('addSubjectCtrl', function ($scope, $ionicLoading, $state, SubjectService, $stateParams, $filter, $ionicHistory, ConfigurationService, $ionicHistory) {
    $scope.isExpanded = true;
    $scope.failed = false;

    $scope.subject = {};
    $scope.categories = [];
    // $scope.categoriesUrl = ConfigurationService.CategoriesUrl();
    $scope.initialForm = function () {

      $scope.subject = {
        title: '',
        user: ConfigurationService.UserDetails()._id,
        description: ''
      }
      SubjectService.GetCategories()
        .then(function (categories) {
          $scope.categories = categories;
        }, function (err) {
        });

    };
    $scope.createSubjectSetp = function (category) {
      $state.go('tab.addSubject-s2', {categoryId: category._id})
    }
    $scope.createSubject = function () {
      // if ($scope.subject.title.length <= 0 ||
       if($scope.subject.description.length <= 0) {
        $scope.failed = true;
        return;
      }
      $scope.subject.category = $state.params.categoryId;
      $ionicLoading.show();
      SubjectService.CreateSubject($scope.subject)
        .then(function () {
          $ionicLoading.hide();
          $ionicHistory.clearHistory();
          $state.go("tab.subjects");

        }, function (err) {
          $ionicLoading.hide();
        });
    }


    $scope.initialForm();
  });

})();
