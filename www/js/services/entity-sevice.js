(function () {
  appServices.factory('EntityService', function (ConfigurationService, $q) {
    var otherProfile = null;
    var messageToDeal = null;
    var deleteFromArray = function (array, item) {
      for (var i = 0; i < array.length; i++) {
        if (array[i]._id == item._id) {
          array.splice(i, 1);
        }
      }
    };
    var setProfile = function (user) {
      otherProfile = user;
    }

    var getOtherProfile = function () {
      return otherProfile;
    }

    var setMessageDetails = function (message) {
      messageToDeal = message;
    }

    var getMessageDetails = function () {
      return messageToDeal;
    }

    return {
      deleteFromArray: deleteFromArray,
      setProfile: setProfile,
      getOtherProfile: getOtherProfile,
      setMessageDetails: setMessageDetails,
      getMessageDetails: getMessageDetails
    };
  });
})();
