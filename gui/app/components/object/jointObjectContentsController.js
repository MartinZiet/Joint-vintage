angular.module('joint.ctrl')
.controller('JointObjectContentsController',[
	'$scope',
	'$element',
	'DirectivePublicApi',
	'$stateParams',
	'Restangular',
	function($scope,$element,api,$stateParams,Restangular){
		
		Restangular.all('objects/'+$stateParams.objectId+'/contents').getList().then(function(contents){
			$scope.contents = contents;
			console.log($scope.contents);
		});
		
		$scope.add = function() {
			alert('add content');
		}
	
}]);