//loading the 'app' angularJS module
var app = angular.module('itemslist', []);
//defining the app controller

app.controller('itemslist', function($scope, $http) {
	$scope.redirect  = function(thisid) {
		window.location = "/item/"+thisid;
	};
})
