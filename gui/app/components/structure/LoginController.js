angular.module('joint.ctrl')

.controller('LoginController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService', 
function($rootScope, $scope, $state, Restangular, $timeout, $global){
	
	$scope.data = {
		login: {},
		signup: {}
	}
	
	$scope.$watch('api',function(n,o){
		Restangular.setBaseUrl(n.url);
		console.log('set base url to '+n.url);
	});
	
	$scope.apis = [
		{name:'local mysql php',url:'../api/api.php'},
		{name:'mockup php',url:'../stuff/api-mockup.php'}	
	];
	
	$scope.api = $scope.apis[0];
	
	$scope.login = function() {
		Restangular.all('login').doPOST($scope.data.login).then(function(obj){
			$global.loginState.status = true;
			$state.go('me.objects',{objectId:obj.object_id});
		});
	}
	
	$scope.signup = function() {
		Restangular.all('signup').doPOST($scope.data.signup);
		console.log($scope.data.signup);
	}
	
}]);