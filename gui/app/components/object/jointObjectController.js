angular.module('joint.ctrl')
.controller('JointObjectController',[
	'$rootScope',
	'$scope',
	'$element',
	'DirectivePublicApi',
	'$stateParams',
	'$state',
	'Restangular',
	function($rootScope,$scope,$element,api,$stateParams,$state,Restangular){
         
	var _extensibleTypes = [0,5,6,82];
				
	$scope.types = $rootScope.types;
	$scope.aliases = $rootScope.aliases;
		
	api.isServer('jointObj',$scope);
		
	$scope.$watch('objectId',function(newId,oldId){		
		
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
			console.log('should remove object '+$scope.obj.id);
		}
	});
	
	$scope.visible = false;
	$scope.transition = false;
			
	$scope.setup = function() {
		if(!$scope.objectsMap) { return false; }
		var m = $scope.objectsMap[$scope.obj.id];		
		var isParent = m && m.children && (m.children.indexOf($scope.objectId) > -1);
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
	   	if($stateParams.friendId) {
	   		$scope.readonly = true;
	   	}
	   	if(!parseInt($scope.obj.parent_id)) {
	   		$scope.isRoot = true;
	   	}
	   	
	   	var notExtensible = (_extensibleTypes.indexOf(parseInt($scope.obj.type)) < 0);
	   	//console.log('type: ' + parseInt($scope.obj.type) + 'notExtensible:' + notExtensible);
	   	
	   	if(!$scope.isRoot && notExtensible) {
	   		$scope.notExtensible = true;
	   	}
	}
	
	$scope.navigate = function() {
		if($scope.readonly) {
			$state.go('friends',{friendId:$stateParams.friendId,objectId:$scope.obj.id});	
		} else {
			$state.go('me.objects',{objectId:$scope.obj.id});
		}
	}
	
	$scope.remove = function() {
		$scope.structureCtrl.remove($scope.obj.id);
		//$scope.obj.remove();
	}
	
	$scope.save = function(frontSave) {	
		$scope.$broadcast('serialize');	
		$scope.obj.save().then(function(obj){
			//console.log('saved');
			//console.log(obj);
			//$state.go('me.objects',{objectId:obj.id},{reload:true});
			$rootScope.$broadcast('sidepanel.refresh');
		});
		if(!frontSave) { $scope.flip(); }
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
			$scope.obj[flag] = 0;
		} else {
			$scope.obj[flag] = 1;
		}
		$scope.save(true);
	}
	
	$scope.toggleFullscreen = function(force) {
		$scope.fullscreen(force);
		setTimeout(function() { $scope.onFullscreen(); },1000);	
	}
	
	
}]);