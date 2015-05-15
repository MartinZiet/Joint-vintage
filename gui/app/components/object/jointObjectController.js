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
		
		$scope.setup();
		
		Restangular.all('types').getList().then(function(types){
			$scope.types = types;
		});
		
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
	
	$scope.save = function(dontflip) {		
		if($scope.obj.post) {
			$scope.obj.post();
		} else {		
			Restangular.one('structure',$scope.obj.parent_id).post($scope.obj);
		}
		if(!dontflip) { $scope.flip(); }
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
	
	$scope.toggleFlag = function(flag) {
		if($scope.obj[flag]) {
			$scope.obj[flag] = false;
		} else {
			$scope.obj[flag] = true;
		}
		$scope.save(true);
	}
	
	$scope.toggleFullscreen = function(force) {
		$scope.fullscreen(force);
		setTimeout(function() { $scope.onFullscreen(); },1000);	
	}
	
	
}]);