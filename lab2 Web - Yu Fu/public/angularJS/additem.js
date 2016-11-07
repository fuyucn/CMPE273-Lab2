
var additem = angular.module('additem', []);

additem.controller('additem', function($scope, $http) {
	$scope.invalid_add = true;
	$scope.invalid_input = true;

	$scope.post = function() {
		if($scope.itemName==null || $scope.detail==null ||$scope.price==null||$scope.quantity==null ||$scope.loc==null ||($scope.bid==null % $scope.showBid == true))
		{
			$scope.invalid_input = false;
		}else{
			$http({
				method : "POST",
				url : "/postItem",
				data : {
					"itemName" : $scope.itemName,
					"detail" :  $scope.detail,
			        "price" : $scope.price,
			        "quantity" : $scope.quantity,
					"loc" : $scope.loc,
					"bid":$scope.bid,
					"useBid": $scope.showBid
				}
			}).success(function(data) {
				console.log("ajs get data");
				console.log(data.statusCode);
				//checking the response data for statusCode
				if (data.statusCode == 401) {
					$scope.invalid_add = false;
					$scope.invalid_input = true;
				}
				else
			      {
			        $scope.invalid_add = true;
			        $scope.invalid_input = true;
			        //Making a get call to the '/redirectToHomepage' API
					console.log("/user/"+data.uid);
			        window.location.assign("/user/"+data.uid);
			      }
			}).error(function(error) {
				$scope.invalid_add = false;
				$scope.invalid_input = true;
			});
		}
	};
})
