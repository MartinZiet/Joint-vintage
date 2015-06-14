angular.module('joint.directives')

	.directive('navbar',function(){
		return {
			templateUrl: 'app/components/navbar/templates/navbar.html',
			controller:'NavbarController',
			link: function(scope, element, attrs) {
				
			}
		}
	});