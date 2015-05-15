angular.module('joint.directives')
.directive('jointObjectContents',function($compile){
	return {
		controller: 'JointObjectContentsController',
		link: function(scope,element,attrs) {
			
			scope.trevorize = function() {
				var txt = element.find('.js-st-instance');
				console.log(txt);
				txt.each(function(i,e) {
					new SirTrevor.Editor({ el: $(e) });
				});
			}
			
		}
	}
});