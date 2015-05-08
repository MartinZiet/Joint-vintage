angular.module('joint.ctrl')

.controller('StructureController',['$rootScope','$scope', '$state', 'Restangular', function($rootScope, $scope, $state, Restangular){
	
	var _this = this;	
	
	$scope.friendId = $state.params.friendId;
	$scope.newId = 999;
		
	this.fetchStructure = function() {
		
		if($scope.friendId) {
			var path = 'friends/'+$scope.friendId+'/objects';
		} else {
			var path = 'structure';
		}
		
		Restangular.all(path).getList().then(function(structure){
  			$scope.structure = structure;
  			if(!$scope.objectId) {
  				$scope.objectId = structure[0].id;
  			}
  			//$scope.$broadcast('structureUpdated');	  			
  		});
  		
	}	
	
	this.add = function() {
		var insertId = $scope.newId;
		$scope.structure.push({id:$scope.newId,parent_id:$scope.objectId,name:'ADD OBJECT'});
		$scope.newId++;
		$scope.$on('objectsRendered',function(){
			$state.go('me.object.edit',{objectId:insertId});
		});		
	}		
	
	this.find = function(id) {
		return _.find($scope.structure,function(obj){
			return obj.id===id;
		});
	}
	
	this.remove = function(id,is_recursive) {
		var obj = _this.find(id);
		var postRemove = function() {
			$scope.structure = _.without($scope.structure,obj);
			var children = _.filter($scope.structure,function(o){
				return o.parent_id===id;
			});
			for(var i = 0; i < children.length; i++) {
				_this.remove(children[i].id,true);
			}
			if(!is_recursive) {
				$state.go('me.object',{objectId:obj.parent_id});
			}
		}
		if(obj.remove && !is_recursive) {
			obj.remove().then(postRemove);
		} else {
			postRemove.call();
		}
	}
	
	$rootScope.$on('$stateChangeSuccess',function(event){
		if($state.params.addObject) {
			_this.add();
		}
	});
	
	_this.fetchStructure();		
	
}]);