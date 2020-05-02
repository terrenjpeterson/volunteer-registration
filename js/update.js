function apiCtrl($scope, $http) {
  $scope.userMessage = '';

  //
  $scope.updateVolunteer = function() {
    // package data from the form for the API to process
    var userData = {};
	userData.streetNumber = $scope.streetNumber;
	userData.streetName = $scope.streetName;
	userData.volunteerName = $scope.volunteerName;

    // call the update block API to process the user request
    $http.post('/updateBlock', userData).success(function(data) {
      // receieve response and place in message field
      $scope.userMessage = data;
    });
  };
}
