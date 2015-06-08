angular.module('joint.directives')

	.directive('mapCanvas',function(){
		return {
			scope: {
				objectsMap: '=',
				objectId: '='
			},
			link: function(scope,element,attrs) {
				
				var offsets = {
					left: 0-(parseInt($(element).css('left'),10)),
					top: 0-(parseInt($(element).css('top'),10)),
					correction: 50
				};
				
				$(element).attr('width',(offsets.left*2));
				$(element).attr('height',(offsets.top*2));				
				
				scope.draw = function() {
					
					//jQuery(element).css('opacity',0);
					//jQuery(element).animate({opacity:1},1000);					
					
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
					
					var off = offsets.correction;
					
					var cx = parseInt(map[id].x)+off;
					var cy = parseInt(map[id].y)+off;
					
					//dzieci		
					if(children) {						
						for (var i=0;i<children.length;++i) {							
							var x=parseInt(map[children[i]].x)+off;
							var y=parseInt(map[children[i]].y)+off;
							scope.line(c,cx,cy,x,y,2,'green');							
						}						
					}
					
					//ojciec
					if (!parent) return;
					x=parseInt(parent.x)+off;
					y=parseInt(parent.y)+off;
					scope.line(c,cx,cy,x,y,6,'brown');				
					
				}	
				
				scope.clear = function(canvas) {
					canvas.clearRect(0, 0, 5000, 5000);
				}
				
				scope.line = function(canvas,start_x,start_y,end_x,end_y,width,style) {
					
					start_x = start_x + offsets.left;
					end_x = end_x + offsets.left;
					
					start_y = start_y + offsets.top;
					end_y = end_y + offsets.top;
					
					console.log('draw line: '+start_x+','+start_y+' to '+end_x+','+end_y);
					
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
