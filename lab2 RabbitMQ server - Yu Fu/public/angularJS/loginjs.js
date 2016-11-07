
var login = angular.module('login', []);

login.controller('login', function($scope, $http) {

	$scope.invalid_signin = true;

  var username = $scope.username;
	$scope.login = function() {
    console.log("try to login");
		$http({
      method : "POST",
			url : '/signin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_signin = false;
			}
			else{
		        $scope.invalid_signin = true;
		        //Making a get call to the '/redirectToHomepage' API
				window.location.assign("/");
	      	}

		}).error(function(error) {
			$scope.invalid_signin = false;
		});
	};
})
