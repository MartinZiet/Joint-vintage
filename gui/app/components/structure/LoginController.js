angular.module('joint.ctrl')

.controller('LoginController',['$rootScope','$scope', '$state', 'Restangular','$timeout', function($rootScope, $scope, $state, Restangular, $timeout){
	
	$rootScope.loginState = {
		status:false
	};
	
	$scope.data = {
		login: {},
		signup: {}
	}
	
	$scope.login = function() {
		Restangular.all('login').doPOST($scope.data.login).then(function(){
			$rootScope.loginState.status = true;
			$state.go('me');
		})
		console.log($scope.data.login);	
	}
	
	$scope.signup = function() {
		Restangular.all('signup').doPOST($scope.data.signup);
		console.log($scope.data.signup);
	}
	
}]);