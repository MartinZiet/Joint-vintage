angular.module('joint.services')
.factory('MapGeometry',[function(){
		
	return {
		apply: function(map) {
			
			var keys = Object.keys(map);
			this.distribute(keys[0],0,map);
			
		},
		
		distribute: function(id, baseAngle, map) {
																				
			var ref = map[id];					
			var children = map[id].children;
			var chLength = 0;
			if(children) {
				var chLength = children.length;
			}					
			var isRoot = !map[id].parent_id; //(id==1);
			var angle = baseAngle;
			
			//if(!isRoot) { ref.addClass('sml'); }
			//ref.addClass('sml');
													
			if(isRoot) {
				
				var x = 600; var y = 275;
										
			} else {
										
				var parent = map[map[id].parent_id];
				
				var x = parseInt(parent.x);
				var y = parseInt(parent.y);
				
				while (angle>2*Math.PI) angle -= 2*Math.PI;
				
				//45*-135*
				if (angle>=Math.PI/4 && angle<=3*Math.PI/4) {
					var r = Math.abs(275/Math.sin(angle));
					y-=275;
					x+=Math.cos(angle)*r;
				}
				//135*-255*
				else if (angle>=3*Math.PI/4 && angle<=5*Math.PI/4) {
					var r = Math.abs(275/Math.cos(angle));
					y-=Math.sin(angle)*r;
					x-=275;;
				}
				else if (angle>=5*Math.PI/4 && angle<=7*Math.PI/4) {
					var r = Math.abs(275/Math.sin(angle));
					y+=275;
					x+=Math.cos(angle)*r;
				}
				else {
					var r = Math.abs(275/Math.cos(angle));
					y-=Math.sin(angle)*r;
					x+=275;
				}
				
				angle += Math.PI;
				
			}
			
			ref.x = Math.round(x); ref.y = Math.round(y);
			
			for(var i = 0; i < chLength; i++) {						
				
				if(isRoot) {
					var chAngle = (i / chLength) * 2 * Math.PI + 3 * Math.PI / 2;
				} else {						
					var chAngle = angle + ((i+1)/(chLength+1))*2*Math.PI;
				}
				
				this.distribute(children[i],chAngle,map);
				
			}					
		}
	}
		
}]);
