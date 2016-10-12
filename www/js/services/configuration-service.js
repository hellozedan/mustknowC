(function () {
  appServices.factory('ConfigurationService', function ($ionicPopup) {
    return {
      ServerUrl: function () {
          return "https://umustknow.herokuapp.com";
        //return "http://localhost:3000";
         //return "http://192.168.1.14:3000";
      },
      FireBaseUrl: function(){
        return "https://mustknow.firebaseIO.com";
      },
      UserDetails: function () {
        if (!this.userDetails) {
          if (window.localStorage['user']) {
            this.userDetails = angular.fromJson(window.localStorage['user']);
          }
        }
        return this.userDetails;
      },
      RefreshUserDetails: function () {
          if (window.localStorage['user']) {
            this.userDetails = angular.fromJson(window.localStorage['user']);
          }
        return this.userDetails;
      },

      Notification_token: function () {
        if (!this.notification_token) {
          if (window.localStorage['notification_token']) {
            this.notification_token = window.localStorage['notification_token']
          }
        }
        return this.notification_token;
      },
      MyFilter: function () {
        if (!this.myFilter) {
          if (window.localStorage['myFilter']) {
            this.myFilter = angular.fromJson(window.localStorage['myFilter'])
          }
        }
        var temp= {};
        angular.copy(this.myFilter,temp);
        return temp ;
      },
      SetMyFilter: function (myFilter) {
        if (myFilter) {
          window.localStorage['myFilter'] = angular.toJson(myFilter);
          this.myFilter = myFilter;
        }
      },
      SetNotification_token: function (notification_token) {
        if (notification_token) {
          window.localStorage['notification_token'] = angular.toJson(notification_token);
          this.notification_token = notification_token;
        }
      },
      showAlert: function() {
        var alertPopup = $ionicPopup.alert({
          title: 'info',
          template: 'wiat for the other user to answer you'
        });
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      },
      LogOut:function () {
        delete this.notification_token;
        delete this.myFilter;
        delete this.userDetails;
      }
    }
  });
})();
