//loading the 'app' angularJS module
var app = angular.module('pay', []);
//defining the app controller

app.controller('pay', function($scope, $http) {

  $scope.invalid_cardnum = true;

  $scope.pay =  function() {
    var cardNum= $scope.cardNum;
    console.log(cardNum);
    console.log("click pay");
    if (!cardNum  || cardNum.length!=16 )
    {
      $scope.invalid_cardnum = false;
    }else{
      $scope.invalid_cardnum = true;
      $http({
        method : "POST",
        url : '/submitCarts',
        data : {
        }
      }).success(function(data) {
        //checking the response data for statusCode
        if (data.statusCode == 401) {
            window.location = "/carts";
        }
        else if (data.statusCode == 200){
            window.location = "/user/"+data.uid;
        }
      }).error(function(error) {
          throw error;
      });
    }

  };

})
