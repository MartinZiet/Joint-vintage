angular.module('joint.ctrl')

.controller('JointObjectTagsController',[
	'$rootScope',
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	function($rootScope,$scope,$stateParams,Restangular,$sce){
		
		var _templateTypeId = 9;
		var _searchTypeId = 8;
		
		//configure templates for object types
		var objectTypeTemplates = {
			8: 'app/components/object/templates/jointObjectTagsEdit.html',
			9: 'app/components/object/templates/jointObjectTagsEditTemplate.html'
		}
		
		$scope.templates = $rootScope.templates;
		
		$scope.tagValue = function(id,val) {
			if(!$scope.obj.tags) { $scope.obj.tags = []; }
			var t = _.findWhere($scope.obj.tags,{name:id});
			if(!t && !val) { return false; }
			if(val && t) { t.points[0].value = val; }
			if(val && !t) { $scope.obj.tags.push({name:id,points:[{value:val}]}); return val; }
			return t.points[0].value;
		}
		
		$scope.reset = function() {
			//reset current view
			$scope.current = {
				tags: []
			};
			var tplId = $scope.tagValue(('_template_id'));
			if(tplId) {
				$scope.current.template = tplId;
			}
		}
		
		$scope.setTags = function(origin) {
			
			var tags = angular.copy(origin.tags);
			
			if($scope.obj.type!=_templateTypeId) {	
				for(var i in tags) {
					tags[i]._values = tags[i].points;
					tags[i].points = [{}];
				}
				tags.verb = origin.verbs[0];
			}			
			
			$scope.current.verbs = origin.verbs;			
			$scope.current.tags = tags;
			
		}
		
		$scope.fetchTags = function() {
			switch($scope.obj.type) {
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
		
		$scope.reset();		
		
		
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
			$scope.tagValue('_template_id',n);
			$scope.fetchTags();			
		});
		
		$scope.$watch('current.tags.verb',function(n,o){
			//console.log(n);
			if(n) {				
				$scope.currentVerbMode = verbModels[n.mode];				
				console.log(verbModels[n.mode]);
			}
		});		
		
		$scope.append = function(tag,value) {
			tag.points.push(value);
		}
		
		$scope.remove = function(tag,val) {
			tag.points = _.without(tag.points,val);
		}
		
		$scope.show = function() {
			//console.log($scope.obj.tags);
			//console.log($scope.current);
			console.log(jQuery.extend($scope.obj.tags,$scope.current.tags));	
			$scope.obj.tags = $scope.current.tags;		
		}
		
		$scope.add = function() {
			$scope.current.tags.push({});
		}
		
		$scope.tag = function(tag) {
			console.log(tag);
		}
	
}]);