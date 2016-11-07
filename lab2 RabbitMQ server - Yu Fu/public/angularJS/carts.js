//loading the 'app' angularJS module
var app = angular.module('carts', []);
//defining the app controller

app.controller('carts', function($scope, $http) {

	$scope.vaild_add = true;
	$scope.invaild_add = true;

  $scope.addToCarts =  function(adid,adname,price,sellerid) {
			console.log("addtocarts");
			console.log(adid);
			console.log(adname);
			console.log(price);
			console.log(sellerid);
		  $scope.carts;
      $http({
        method : "POST",
        url : '/addToCarts',
        data : {
          "adid" : adid,
          "name" : adname,
          "price": price,
					"sellerid": sellerid
        }
      }).success(function(data) {
        //checking the response data for statusCode
        if (data.statusCode == 200) {
						$scope.vaild_add = false;
						$scope.invaild_add = true;
						window.alert("Add successful");
						window.location = "/carts";
					 $scope.carts=data.carts;
        }
        else if (data.statusCode == 400){
					$scope.vaild_add = true;
					$scope.invaild_add = false
					window.alert("You need login first");
					window.location = "/login";

				}
      }).error(function(error) {
					throw error;
      });
  };

})
