angular.module('joint.ctrl')

.controller('LoginController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService', 
function($rootScope, $scope, $state, Restangular, $timeout, $global){
	
	$scope.data = {
		login: {},
		signup: {}
	}
	
	$scope.$watch('api',function(n,o){
		$global.api(n);
		Restangular.setBaseUrl(n.url);
		toastr.info(n.url,'Setting API url');
	});
	
	$scope.apis = [
		{name:'local mysql php',url:'../api/api.php'},
		{name:'mockup php',url:'../stuff/api-mockup.php'},
		{name:'s18367520.onlinehome-server.info/Joint/api/api.php',url:'http://s18367520.onlinehome-server.info/Joint/api/api.php'}	
	];
	
	$scope.api = $scope.apis[0];
	
	$scope.login = function() {
		Restangular.all('login').doPOST($scope.data.login).then(function(obj){
			if(obj && obj.object_id) {
				$global.login(obj);
				toastr.success('Successful login','Welcome!');
				$state.go('me.objects',{objectId:obj.object_id});
			}
		});
	}
	
	$scope.signup = function() {
		Restangular.all('signup').doPOST($scope.data.signup).then(function(obj){
			if(obj) {
				$global.login(obj);
				$state.go('me.objects',{objectId:obj.object_id});
			}
		});
	}
	
}]);