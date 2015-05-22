angular.module('joint.ctrl')
.controller('JointObjectContentsController',[
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	function($scope,$stateParams,Restangular,$sce){
		
		var _this = this;
		
		$scope.$watch('active',function(n,o){
			if(!n) { return false; }
			Restangular.all('structure').one('objects',$stateParams.objectId).all('contents').getList().then(function(contents){
				$scope.contents = contents;
			});
		});		
		
		this.find = function(id) {
			return _.find($scope.contents,function(obj){
				return obj.id===id;
			});
		}
		
		$scope.safe = function(str) {
			return $sce.trustAsHtml(str);
		}
		
		$scope.add = function() {
			$scope.contents.push({});
			$scope.toggleFullscreen(true);
		}
		
		$scope.remove = function(obj) {
			if(obj.remove) { obj.remove(); }
			$scope.contents = _.without($scope.contents,obj);			
		}
	
}]);