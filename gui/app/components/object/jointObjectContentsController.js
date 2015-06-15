angular.module('joint.ctrl')
.controller('JointObjectContentsController',[
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	'JointTags',
	function($scope,$stateParams,Restangular,$sce,JointTags){
		
		var _this = this;
		
		$scope.$watch('active',function(n,o){
			if(!n) { return false; }
			Restangular.one('objects',$stateParams.objectId).all('contents').getList().then(function(contents){
				$scope.contents = contents;
			});
		});		
		
		$scope.contentTypes = JointTags.contentTypes();
		
		this.find = function(id) {
			return _.find($scope.contents,function(obj){
				return obj.id===id;
			});
		}
		
		$scope.safe = function(str) {
			return $sce.trustAsHtml(str);
		}
		
		$scope.add = function(type) {
			var newCnt = {
				tags: {
					content_type: type
				}
			};
			
			$scope.contents.unshift(newCnt);
		}
		
		$scope.remove = function(obj) {
			bootbox.confirm('Are you sure?',function(result) {
				if(result) {
					if(obj.remove) { obj.remove(); }
					$scope.contents = _.without($scope.contents,obj);
				}
			});
		}
	
}]);