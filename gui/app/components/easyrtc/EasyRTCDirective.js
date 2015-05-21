angular.module('joint.directives')

	.directive('easyrtc',function(){
		return {
			templateUrl: 'app/components/easyrtc/templates/ertc.html',
            scope: {
                userId: '@'
            },
			controller:'EasyRTCController',
            
			link: function(scope, element, attrs) {
			}
		}
	});