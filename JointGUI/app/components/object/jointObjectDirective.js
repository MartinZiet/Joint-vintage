angular.module('joint.directives')
.directive('jointObject',function(){
	return {
		scope: {
			obj: '=',
			objectId: '=',
			objectsMap: '=',
			structureCtrl: '='
		},
		controller: 'JointObjectController',
		templateUrl: 'app/components/object/templates/jointObject.html',
		link: function(scope,element,attrs) {	
			
			scope.setPosition = function(pos) {
				element.css('left',pos.x+'px');
				element.css('top',pos.y+'px');
			}
			
			scope.getPosition = function() {
				return element.offset();
			}
			
		}
	}
});