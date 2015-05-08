angular.module('joint.ctrl')
.controller('JointObjectController',[
	'$scope',
	'$element',
	'DirectivePublicApi',
	'$stateParams',
	'Restangular',
	function($scope,$element,api,$stateParams,Restangular){
		
	api.isServer('jointObj',$scope);
		
	$scope.$watch('objectId',function(newId,oldId){	
		console.log('objectId: '+$scope.objectId);	
		$scope.setup();
	});
	
	$scope.$watch('objectsMap',function(){
		$scope.setup();
	});	
	
	$scope.$watch('transition',function(t){
		if(t) {
			setTimeout(function(){				
				$scope.$apply(function() {
					$scope.transition = false;
				});				
			},400);
		}
	});
	
	$scope.$watch('active',function(n,o){
		if(!n && !$stateParams.addObject && !$scope.obj.fromServer) {
			console.log($scope.structureCtrl);
			//$scope.structureCtrl.add();
			console.log('should remove object '+$scope.obj.id);
		}
	});
	
	$scope.visible = false;
	$scope.transition = false;
			
	$scope.setup = function() {
		if(!$scope.objectsMap) { return false; }
		var m = $scope.objectsMap[$scope.obj.id];		
		var isParent = m && m.children && (m.children.indexOf($scope.objectId*1) > -1);
		$scope.active = (($scope.obj.id==$scope.objectId) && !$stateParams.addObject);
		$scope.sml = !$scope.active;
		$scope.visible = ($scope.obj.parent_id==$scope.objectId) 
						 || $scope.active
						 || isParent;						 
	    $scope.ready = true;
	    if($scope.active) {
	    	$scope.transition = true;	    		    		    	
	   	}	    
	   	if($scope.active && $stateParams.editObject) {
	   		$scope.flipped = true;
	   	} else {
	   		$scope.flipped = false;
	   	}
	}
	
	$scope.remove = function() {
		$scope.structureCtrl.remove($scope.obj.id);
		//$scope.obj.remove();
	}
	
	$scope.save = function() {
		console.log($scope.obj);
		Restangular.one('structure',$scope.obj.parent_id).post($scope.obj);
	}
			
	$scope.focus = function() {
		$scope.obj.focused = true;
	}	
			
	$scope.flip = function(force) {
		if(!$scope.flipped || force) {
			$scope.flipped = true;
		} else {
			$scope.flipped = false;
		}
	}	
	
}]);