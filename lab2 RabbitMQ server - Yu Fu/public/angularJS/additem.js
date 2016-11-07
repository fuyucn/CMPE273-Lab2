
var additem = angular.module('additem', []);

additem.controller('additem', function($scope, $http) {
	$scope.invalid_add = true;
	console.log("ajs start");
	$scope.post = function() {
		$http({
			method : "POST",
			url : '/postItem',
			data : {
				"itemName" : $scope.itemName,
				"detail" :  $scope.detail,
        "price" : $scope.price,
        "quantity" : $scope.quantity,
				"loc" : $scope.loc
			}
		}).success(function(data) {
			console.log("ajs get data");
			console.log(data.statusCode);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_add = false;
			}
			else
      {
        $scope.invalid_add = true;
        //Making a get call to the '/redirectToHomepage' API
		console.log("/user/"+data.uid);
        window.location.assign("/user/"+data.uid);
      }

		}).error(function(error) {
			$scope.invalid_add = false;
		});
	};
})
