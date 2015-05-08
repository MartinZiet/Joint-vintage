angular.module('joint.directives')
.directive('jointObjectContents',function(){
	return {
		scope: {
			obj: '=',
			contents: '='
		},
		controller: 'JointObjectContentsController'
	}
});