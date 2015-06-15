angular.module('joint.directives')
.directive('jointObjectTagsList',function($compile){
	return {
		templateUrl: 'app/components/object/templates/jointObjectTagsList.html',
		link: function(scope,element,attrs) {
			scope.tagsList = scope[attrs.tagsKey];
			console.log('tagsList'); console.log(scope.tagsList); console.log(attrs);
		}
	}
});