angular.module('joint.directives')

	.directive('sidepanel',function(){
		return {
			templateUrl: 'app/components/sidepanel/templates/sidepanel.html',
			controller:'SidepanelController',
			link: function(scope, element, attrs) {
				
			}
		}
	});
