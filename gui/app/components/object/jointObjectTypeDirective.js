angular.module('joint.directives')
.directive('jointObjectType',function($compile){
	return {		
		scope: {
			obj: '='
		},
		template: '<i class="fa fa-{{icon}}"></i>',
		link: function(scope,element,attrs) {
			scope.$watch('obj.type',function(n,o){
				switch(n) {
					case 15: scope.icon = 'folder-o'; break;
					case 18: scope.icon = 'tags'; break;
					case 17: scope.icon = 'search'; break;
					case 0: scope.icon = 'cog'; break;
					default: scope.icon = 'globe'; break;
				}
			});
		}
	}
});