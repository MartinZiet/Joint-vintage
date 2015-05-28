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
		var _activated = false;
		
		//configure templates for object types
		var objectTypeTemplates = {
			8: 'app/components/object/templates/jointObjectTagsEdit.html',
			9: 'app/components/object/templates/jointObjectTagsEditTemplate.html'
		}
		
		$scope.verbModes = JointTags.verbModes();
		$scope.templates = $rootScope.templates;
		
		$scope.addTag = addTag;
		$scope.removeTag = deleteTag;
		
		$scope.addPoint = addPoint;
		$scope.deletePoint = deletePoint;
		
		$scope.serializeTags = serializeTags;
		
		$scope.changeTagType = changeTagType;
		
		activate();
		
		function activate() {
			
			$scope.dataTypes = JointTags.dataTypes();
			$scope.domains = JointTags.domains();
			
			$scope.$watch('obj.type',watchType);
			$scope.$watch('current._meta._template_id.points[0].value',watchTemplate);
			$scope.$watch('current._meta._verb.points[0].value',watchVerb);
			
			$scope.$on('serialize',serializeTags);
			
		}
		
		function watchType(n,o) {
			
			var n = parseInt(n);
			
			$scope.objectTypeTemplate = objectTypeTemplates[n];
			
			switch(n) {
				case _templateTypeId:
					$scope.verb_mode = 1; 
					$scope.current = JointTags.factory('template');
				break;
				case _searchTypeId: $scope.current = JointTags.factory('search'); break;
			}
			
			//console.log('unserialize type:'+n);
			var objTags = JointTags.unserialize($scope.obj.tags);
			
			if(parseInt($scope.obj.type)==_searchTypeId) {
				$scope.current = _.merge(objTags,$scope.current);
			} else {				
				if(!objTags.tags._verb) {				
					var merge = _.partialRight(_.assign, function(value, other) {
	  					return _.isUndefined(value) ? other : value;
					});
					$scope.current  = merge($scope.current,objTags);
				} else {
					$scope.current = _.assign($scope.current,objTags);
				}
				if($scope.current && $scope.current.tags) {
					$scope.current.tags = JointTags.convertToArray($scope.current.tags);
				}	
			}
			
			console.log('unserialized:');
			console.log(objTags);
			
		}
		
		function watchTemplate(n,o) {
			if(!n) { return false; }
			console.log('newTemplate');
			Restangular.one('objects',n).get().then(function(obj){
				var merged = JointTags.fromTemplate(obj.tags,$scope.current);
				$scope.current = merged;
				watchVerb($scope.current._meta._verb.points[0].value);
				console.log(merged);
			});
		}
		
		function watchVerb(n,o) {
			if(!n) { return false; }
			if(!$scope.current || !$scope.current.tags || !$scope.current.tags._verb) { return false; }
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
			if($scope.obj.type==_searchTypeId) {
				if(!tag.points) { tag.points = []; }
				tag.points.push(JointTags.factory('point'));
			} else {
				if(!tag._values) { tag._values = []; }
				tag._values.push(JointTags.factory('point'));
			}
		}
		
		function deletePoint(tag,point) {
			if($scope.obj.type==_searchTypeId) {
				tag.points = _.without(tag.points,point);
			} else {
				tag._values = _.without(tag._values,point);
			}
		}		
		
		function changeTagType(tag,typeId) {
			
			tag.type = typeId;
			return false;
			
		}
		
		function serializeTags() {
			
			if(parseInt($scope.obj.type) == _searchTypeId) {
				var tags = JointTags.serializeAsIntention($scope);
			} else {
				var tags = JointTags.serialize($scope.current);	
			}
			$scope.obj.tags = tags;
			return true;
			
		}
	
}]);