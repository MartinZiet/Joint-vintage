angular.module('joint.ctrl')

.controller('JointObjectTagsController',[
	'$rootScope',
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	'JointTags',
	function($rootScope,$scope,$stateParams,Restangular,$sce,JointTags){
		
		var _templateTypeId = 9;
		var _searchTypeId = 8;
		
		//configure templates for object types
		var objectTypeTemplates = {
			8: 'app/components/object/templates/jointObjectTagsEdit.html',
			9: 'app/components/object/templates/jointObjectTagsEditTemplate.html'
		}
		
		$scope.templates = $rootScope.templates;
		
		$scope.addTag = addTag;
		$scope.removeTag = deleteTag;
		
		$scope.addPoint = addPoint;
		$scope.deletePoint = deletePoint;
		
		$scope.save = save;
		
		activate();
		
		function activate() {
			
			$scope.dataTypes = JointTags.dataTypes();
			$scope.domains = JointTags.domains();
			
			$scope.$watch('obj.type',watchType);
			$scope.$watch('current._meta._template_id.points[0].value',watchTemplate);
			$scope.$watch('current._meta._verb.points[0].value',watchVerb);
			
		}
		
		function watchType(n,o) {
			
			var n = parseInt(n);
			
			$scope.objectTypeTemplate = objectTypeTemplates[n];
			
			switch(n) {
				case _templateTypeId: $scope.current = JointTags.factory('template'); break;
				case _searchTypeId: $scope.current = JointTags.factory('search'); break;
			}
			
			//console.log('unserialize type:'+n);
			var objTags = JointTags.unserialize($scope.obj.tags);
			$scope.current = _.merge(objTags,$scope.current);
			console.log($scope.current);
			
		}
		
		function watchTemplate(n,o) {
			console.log('newTemplate');
			Restangular.one('objects',n).get().then(function(obj){
				var merged = JointTags.fromTemplate(obj.tags,$scope.current);
				$scope.current = merged;
				console.log(merged);
			});
		}
		
		function watchVerb(n,o) {
			console.log('new verb:' + n);
			var v = _.findWhere($scope.current.tags._verb._values,{value:n});
			$scope.verb_mode = v.verb_mode;
		}
		
		function watchVerbMode(n,o) {
			
		}
		
		function addTag() {
			$scope.current.tags.push(JointTags.factory('tag'));
		}
		
		function deleteTag(tag) {
			
		}
		
		function addPoint(tag) {
			tag._values.push(JointTags.factory('point'));
		}
		
		function deletePoint(tag,point) {
			tag._values = _.without(tag._values,point);
		}
		
		function save() {
			if(parseInt($scope.obj.type) == _searchTypeId) {
				var tags = JointTags.serializeAsIntention($scope);
			} else {
				var tags = JointTags.serialize($scope.current);	
			}
			$scope.obj.tags = tags;
			console.log(tags);
		}
	
}]);