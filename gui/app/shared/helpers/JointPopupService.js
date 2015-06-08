angular.module('joint.services')

	.factory('JointPopup',['$compile',function($compile){
		
		return {
			show: function(targetScope,tpl) {
				var html = '<jointpopup tpl="' + tpl + '"></jointpopup>';
				var elm = angular.element(html);
				var linkFn = $compile(elm);
				var content = linkFn(targetScope);
				var cfg = {
					message: content
				};
				bootbox.dialog(cfg);
			}
		}
		
	}]);