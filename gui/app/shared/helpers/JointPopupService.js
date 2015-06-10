angular.module('joint.services')

	.factory('JointPopup',['$compile',function($compile){
		
		return {
			show: function(config) {
				var html = '<jointpopup tpl="' + config.templateUrl + '"></jointpopup>';
				var elm = angular.element(html);
				var linkFn = $compile(elm);
				var content = linkFn(config.scope);
				var cfg = {
					message: content
				};
				bootbox.dialog(cfg);
				setTimeout(function(){
					config.link();
				},200);
			}
		}
		
	}]);