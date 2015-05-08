angular.module('joint.ctrl')
.controller('MapStageController',['$scope','$element','DirectivePublicApi','MapGeometry',function($scope,$element,api,geometry){
		
	api.isClient('obj','jointObj',$scope);
			
	$scope.serializeStructure = function() {
		
		var byParent = {};
		var objMap = {};
		var len = $scope.structure.length;
		//var parentId = o.parent_id;
		//if(!parentId) { parentId = 0; }
		
		for(var i=0; i < len; i++) {
			var o = $scope.structure[i];
			if(!byParent[o.parent_id]) { byParent[o.parent_id] = []; }
			byParent[o.parent_id].push(o.id);
		}
		
		for(var i=0; i < len; i++) {
			var o = $scope.structure[i];
			objMap[o.id] = {id:o.id,parent_id:o.parent_id,children:byParent[o.id]};
		}
		
		return objMap;
		
	}
	
	$scope.applyPositions = function(map) {
		for(i in map) {
			var e = map[i];
			var pos = {x:e.x,y:e.y};
			$scope.obj(e.id,'setPosition',pos);
		}
	}	
			
	$scope.$on('ngRepeatFinished',function(){		
		$scope.objectsMap = $scope.serializeStructure();
		geometry.apply($scope.objectsMap);
		$scope.applyPositions($scope.objectsMap);
		setTimeout(function(){
			$scope.$broadcast('objectsRendered');	
		},100);		
	});
	
}]);