angular.module('joint.directives')
.directive('mapViewport',function(){
	return {		
		template: '<canvas map-canvas objects-map="objectsMap" object-id="objectId"></canvas><div map-stage></div>',
		controller: 'MapViewportController',
		link: function(scope, element, attrs) {
			
			scope.translatePosition = function(pos) {
				
				var v = element.parent();
				var vin = element;
					
				var vw = v.width();
				var vh = v.height();				
										
				pos.x = ((vw+0)/2)-pos.x;
				pos.y = ((vh/2)-pos.y)-80;
				
				return pos;
			}
							
			scope.centerViewport = function() {				
				
				var o = scope.objectsMap[scope.objectId];				
				var pos = {x:o.x,y:o.y};
				pos = scope.translatePosition(pos);
				
				element.css('left',pos.x+'px');
				element.css('top',pos.y+'px');
				element.addClass('transition');
				
				setTimeout(function(){
					element.removeClass('transition');
				},400);
								
			}
			
		}
	}
});