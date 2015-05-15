angular.module('joint.directives')
.directive('jointObjectTags',function($compile){
	return {		
		controller: 'JointObjectTagsController',
		templateUrl: 'app/components/object/templates/jointObjectTags.html',
		link: function(scope,element,attrs) {
			
		}
	}
});