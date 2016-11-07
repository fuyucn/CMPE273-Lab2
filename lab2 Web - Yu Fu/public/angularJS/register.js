
var login = angular.module('register', []);

login.controller('register', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error'
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_reg = true;
	$scope.invalid_email = true;
	$scope.invalid_user = true;
	$scope.invalid_pw = true;
	$scope.invalid_fname = true;
	$scope.invalid_lname = true;
	$scope.invalid_loc = true;
	$scope.valid_reg=false;




	$scope.submit = function() {

		$http({
			method : "POST",
			url : '/regUser',
			data : {
				"username" : $scope.username,
				"password" :  $scope.password,
		        "firstname" : $scope.firstname,
		        "lastname" : $scope.lastname,
				"location" : $scope.location
			}
		}).success(function(data) {

			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_reg = false;
				$scope.invalid_email = true;
			 
			}
			else if (data.statusCode==400){
				$scope.invalid_reg = true;
		        $scope.invalid_email = false;

		    }
		    else{
				$scope.invalid_reg = true;
		        $scope.invalid_email = true;
		        console.log("new reg suc!");
		        //Making a get call to the '/redirectToHomepage' API
		        //$location.path("/");
		        $('#myModal').modal({
                    keyboard: true
                });


		        //window.alert("Register successful");
		    }

		}).error(function(error) {
			$scope.invalid_reg = false;
	        $scope.invalid_email = true;
		});
	};
})
