angular.module('joint.directives')
.directive('jointObjectType',function($compile){
	return {		
		scope: {
			obj: '='
		},
		template: '<i class="fa fa-{{icon}}"></i>',
		link: function(scope,element,attrs) {
			scope.$watch('obj.type',function(n,o){
				switch(parseInt(n)) {
					case 82: scope.icon = 'folder-o'; break;
					case 6: scope.icon = 'folder-o'; break;
					case 9: scope.icon = 'tags'; break;
					case 8: scope.icon = 'search'; break;
					case 0: scope.icon = 'cog'; break;
					default: scope.icon = 'globe'; break;
				}
				if(parseInt(scope.obj.parent_id)==0) {
					scope.icon = 'user';
				}
			});
		}
	}
});