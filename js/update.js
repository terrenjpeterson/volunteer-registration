function apiCtrl($scope, $http) {
  $scope.userMessage = '';

  //
  $scope.updateVolunteer = function() {
    $scope.streets = [];
    // package data from the form for the API to process
    var userData = {};
	userData.streetNumber  = $scope.streetNumber;
	userData.streetName    = $scope.streetName;
	userData.volunteerName = $scope.volunteerName;
	userData.cityName      = $scope.cityName;

    // call the update block API to process the user request
    $http.post('/updateBlock', userData).success(function(data) {
      // receieve response and place in message field
      // {"leftFromAddress":"500","leftToAddress":"528","rightFromAddress":"501","rightToAddress":"527"}
      $scope.userMessage = data.message;

      // if there are multiple streets to select from, share the array back with the form
      $scope.streets = data.blocks;
    });
  };

  $scope.updateMap = function() {
    var mapData = {};

    // call the publish tileset API to update the current view of the map for users
    $http.post('/updateMap', mapData).success(function(data) {
      // receive response and place in message field
      $scope.userMessage = data.message;
    });
  };
}
