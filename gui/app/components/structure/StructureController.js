angular.module('joint.ctrl')

.controller('StructureController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService', 
			function($rootScope, $scope, $state, Restangular, $timeout, $global){
	
	var loggedIn = $global.checkLogin();
	if(!loggedIn) { return false; }
	
	var _this = this;	
	
	$scope.resourcesCount = 2;
	$scope.resourcesLoaded = 0;
	
	Restangular.all('templates').getList().then(function(templates) {
		$rootScope.templates = templates;
		$scope.resourcesLoaded++;
	});
	
	Restangular.all('types').getList().then(function(types){
		$rootScope.types = types;
		$scope.resourcesLoaded++;
	});
	
	$scope.$watch('resourcesLoaded',function(n,o){
		if(n >= $scope.resourcesCount) {
			_this.fetchStructure();
		}
	});
	
	if(!$rootScope.loginState || !$rootScope.loginState.status) {
		//$state.go('login');
		//return;
	}
	
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
  				//$scope.objectId = structure[0].id;
  				$state.go('me.objects',{objectId:structure[0].id});
  			}
  			//$scope.$broadcast('structureUpdated');	  			
  		});
  		
	}	
	
	this.add = function() {
		var insertId = $scope.newId;
		Restangular.all('structure').one('objects',$scope.objectId).put({parent_id:$scope.objectId,name:'ADD OBJECT'}).then(function(obj) {
			$scope.structure.push(obj);
			$state.go('me.objects.edit',{objectId:obj.id});
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
				return o.parent_id===id && (o.parent_id!=o.id);
			});
			for(var i = 0; i < children.length; i++) {
				_this.remove(children[i].id,true);
			}
			if(!is_recursive) {
				$state.go('me.objects',{objectId:obj.parent_id});
				
			}
		}
		if(obj.remove && !is_recursive) {
			obj.remove().then(postRemove);
		} else {
			postRemove.call();
		}
	}
	
	//_this.fetchStructure();		
	
}]);