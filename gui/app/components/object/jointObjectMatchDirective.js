angular.module('joint.directives')
.directive('jointObjectMatch',function($compile){
	return {
		scope: {
			obj: '='
		},
		controller: 'JointObjectMatchController',
		templateUrl: 'app/components/object/templates/jointObjectMatch.html',
		link: function(scope,element,attrs) {
			
		}
	}
});