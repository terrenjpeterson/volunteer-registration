function apiCtrl($scope, $https) {
  $scope.validAddress = false;
  $scope.userMsg = '';

  //
  $scope.updateVolunteer = function() {
    var userData = {};

    $http.post('/validateGame', userData).success(function(data) {
      $scope.loginResponse = data;
    });
  };
}
