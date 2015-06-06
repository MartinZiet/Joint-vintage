angular.module('joint.directives')
    .directive('easyrtc',function(){
		return {
            restrict: 'E',
            templateUrl: 'app/components/easyrtc/templates/ertc.html',
            scope: {},
			controller:'EasyRTCController',
			link: function(scope, element, attrs) {
            }
		}
	});

angular.module('joint.directives')
    .directive('ertctools',function(){
		return {
            restrict: 'E',
            templateUrl: 'app/components/easyrtc/templates/ertc_tools.html',
            scope: {
                friendId: '=',
                object: '='
            },
			controller:'EasyRTCToolController',
			link: function(scope, element, attrs) {
            }
		}
    });