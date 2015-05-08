angular.module('joint.ctrl')

.controller('MapViewController',['$rootScope','$scope','$stateParams',function($rootScope, $scope,$stateParams){
			
	$scope.objectId = $stateParams.objectId;
	
	$rootScope.$on('$stateChangeSuccess',function(event){
		$scope.objectId = $stateParams.objectId;
	});	
		
}]);