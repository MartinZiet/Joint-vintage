angular.module('joint.directives')
    .directive('easyrtc',function(){
		return {
            restrict: 'E',
            templateUrl: 'app/components/easyrtc/templates/ertc.html',
            scope: {
                friendId: '=',
                objectId: '='
            },
			controller:'EasyRTCController',
			link: function(scope, element, attrs) {
            }
		}
	});