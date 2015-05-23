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
		
		$scope.createValue = function(t) {
			return {value:t};
		}
		
		$scope.tagValue = function(id,val,type) {
			if(!$scope.current.tags) { $scope.current.tags = []; }
			var t = _.findWhere($scope.current.tags,{name:id});
			if(!t && !val) { return false; }
			if(val && t) { t.points[0].value = val; }
			if(val && !t) {
				var newTag = {name:id,points:[{value:val}]};
				if(type) { newTag.type = type; }
				$scope.current.tags.push(newTag); return val;
			}
			return t.points[0].value;
		}
		
		$scope.reset = function() {
			//reset current view
			$scope.current = {
				tags: JointTags.unserialize(angular.copy($scope.obj.tags))
			};
			var tplId = $scope.tagValue(('_template_id'));
			if(tplId) {
				$scope.current.template = tplId;
			}
		}
		
		$scope.setTags = function(origin) {
			
			var objTags = JointTags.unserialize(
				angular.copy($scope.obj.tags)
			);
				
			var cTags = $scope.current.tags;
			
			var tags = JointTags.unserialize(
				angular.copy(origin.tags)
			);
			
			console.log('setTags');
			console.log(objTags);
			console.log(cTags);
			console.log(tags);
			
			//var cTags = JointTags.merge(cTags,objTags);
			var tags = JointTags.merge(cTags,tags);
			
			if(parseInt($scope.obj.type)!=_templateTypeId) {
			}			
			
			$scope.current.verbs = origin.verbs;			
			$scope.current.tags = tags;
			
		}
		
		$scope.fetchTags = function() {
			switch(parseInt($scope.obj.type)) {
				//use objects own tags to edit template
				case _templateTypeId:
					$scope.setTags($scope.obj);
					return;
				break;
				//fetch template object tags
				case _searchTypeId:
					var tplId = $scope.current.template;
					if(!tplId) {
						$scope.reset();
						return;
					}
					Restangular.one('objects',tplId).get().then(function(ob) {
						$scope.setTags(ob);						
					});
				break;
			}			
			return;
		}
		
		$scope.$watch('obj.type',function(n,o){						
			$scope.objectTypeTemplate = objectTypeTemplates[n];
			$scope.reset();
			setTimeout(function(){
				$scope.fetchTags();
			},100);			
		});
		
		//verb models config (to be fetched from api??)
		var verbModels = {
			offer: { specific: true },
			want: { specific: false },
			exchange: {},
			tag: {}			
		};
		
		$scope.$watch('current.template',function(n,o){
			$scope.tagValue('_template_id',n,99);
			$scope.fetchTags();			
		});
		
		$scope.$watch('current.tags._verb',function(n,o){
			//console.log(n);
			if(n) {				
				$scope.currentVerbMode = verbModels[n.mode];				
				console.log(verbModels[n.mode]);
			}
		});		
		
		$scope.append = function(tag,value) {
			if(!tag._values) { tag._values = []; }
			tag._values.push(value);
		}
		
		$scope.remove = function(tag,val) {
			tag._values = _.without(tag._values,val);
		}
		
		$scope.show = function() {
			var tags = JointTags.serialize($scope.current.tags);
			console.log(tags);	
			$scope.obj.tags = tags;		
		}
		
		$scope.add = function() {
			$scope.current.tags.push({});
		}
		
		$scope.tag = function(tag) {
			console.log(tag);
		}
		
		$scope.reset();		
		$scope.fetchTags();
		
		console.log($scope.current);
	
}]);