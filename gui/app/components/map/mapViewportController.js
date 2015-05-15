angular.module('joint.ctrl')

.controller('MapViewportController',['$scope', 'DirectivePublicApi',function($scope,api){	
	
	api.isClient('obj','jointObj',$scope);			
	
	$scope.$on('objectsRendered',function(){
		$scope.$watch('objectId',function(newId,oldId){
			$scope.centerViewport();						
		});	
		$scope.centerViewport();
		$scope.ready = 1;		
	})
		
}]);