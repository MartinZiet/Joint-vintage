angular.module('joint.directives')
.directive('jointObject',function(){
	return {
		scope: {
			obj: '=',
			objectId: '=',
			objectsMap: '=',
			structureCtrl: '=',
			onFullscreen: '='
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
			
			scope.fillViewport = function() {
			}
			
			scope.fullscreen = function(force) {
				var view = jQuery('[map-view]');
				var e = element.find('.joint-object');
				if(!element.hasClass('fullscreen') || force) {
					e.css('width',view.width()+'px');
					e.css('height',view.height()+'px');
					element.addClass('fullscreen');
					view.addClass('fullscreen')
				} else {
					e.css('width','').css('height','');
					element.removeClass('fullscreen');
					view.removeClass('fullscreen');
				}
			}
			
		}
	}
});