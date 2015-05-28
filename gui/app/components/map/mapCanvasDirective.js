angular.module('joint.directives')

	.directive('mapCanvas',function(){
		return {
			scope: {
				objectsMap: '=',
				objectId: '='
			},
			link: function(scope,element,attrs) {
				
				scope.draw = function() {
					
					jQuery(element).css('opacity',0);
					
					var id = scope.objectId;
					var map = scope.objectsMap;
					
					if(!id || !map) { return false; }
					
					var c = element[0].getContext('2d');
					var children = map[id].children;
					
					scope.clear(c);
					
					if(map[id].parent_id) {
						var parent = map[map[id].parent_id];
					} else {
						var parent = false;
					}
					
					var cx = parseInt(map[id].x);
					var cy = parseInt(map[id].y);
					
					//dzieci		
					if(children) {						
						for (var i=0;i<children.length;++i) {							
							var x=parseInt(map[children[i]].x)+50;
							var y=parseInt(map[children[i]].y)+50;
							scope.line(c,cx,cy,x,y,2,'green');							
						}						
					}
					
					//ojciec
					if (!parent) return;
					x=parseInt(parent.x)+50;
					y=parseInt(parent.y)+50;
					scope.line(c,cx,cy,x,y,6,'brown');
					
					
					jQuery(element).animate({opacity:1},1000);					
					
				}	
				
				scope.clear = function(canvas) {
					canvas.clearRect(0, 0, 5000, 5000);
				}
				
				scope.line = function(canvas,start_x,start_y,end_x,end_y,width,style) {
					
					canvas.beginPath();
					canvas.strokeStyle = style;
					canvas.lineWidth = width;
					canvas.moveTo(start_x,start_y);
					canvas.lineTo(end_x,end_y);
					canvas.stroke();
					
				}			
				
				scope.$watch('objectsMap',function(){					
					scope.draw();					
				});
								
				scope.$watch('objectId',function(n,o){
					if(!n) {
						jQuery(element).css('opacity',0);
					} else {
						scope.draw();
					}					
				});
				
				setTimeout(function(){
					//scope.draw();
				},1000);
				
			}	
		}
	});
