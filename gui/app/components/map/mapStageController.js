angular.module('joint.ctrl')
.controller('MapStageController',['$rootScope','$scope','$element','DirectivePublicApi','MapGeometry',function($rootScope,$scope,$element,api,geometry){
		
	var self = this;
	self.packeryObjects = [];
	api.isClient('obj','jointObj',$scope);
			
	$scope.serializeStructure = function() {
		
		var byParent = {};
		var objMap = {};
		var len = $scope.structure.length;	
		
		console.log($scope.structure);	
		
		for(var i=0; i < len; i++) {
			var o = $scope.structure[i];			
			if(!byParent[o.parent_id]) { byParent[o.parent_id] = []; }
			byParent[o.parent_id].push(o.id);
		}
		
		for(var i=0; i < len; i++) {
			var o = $scope.structure[i];
			objMap[o.id] = {id:o.id,parent_id:o.parent_id,children:byParent[o.id]};
		}
		
		console.log(byParent);
		console.log(objMap);
		
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
		$scope.rendered();
	});	
	
	$scope.rendered = function() {
		setTimeout(function(){
			$scope.$broadcast('objectsRendered');			
		},100);
	}
	
}]);