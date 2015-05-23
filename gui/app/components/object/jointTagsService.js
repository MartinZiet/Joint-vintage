angular.module('joint.services')

.factory('JointTags',[function(){
	return {
		
		dataTypes: function() {
			
			return {
				hidden: {
					icon: 'cog'
				},
				text: {
					icon: 'terminal'
				},
				select: {
					icon: 'terminal'
				},
				range: {
					icon: 'arrows-h'
				},
				geo: {
					icon: 'globe'
				}
			};
			
		}
		
		domains: function() {
			return ['wants','offers','_meta'];
		},
		
		factory: function(type) {
			
			switch(type) {
				case 'search':
					return {
						wants: {},
						offers: {},
						_meta: {
							_template_id: {
								type:'hidden'
							},
							_verb: {}
						}
					}
				break;
				
				case 'template':
					return {
						tags: {
							_verbs: {
								domain: '_meta',
								_values: []
							}
						}
					}
				break;
			}
			
		},
		
		merge: function(tags1,tags2) {
			
			var tags1 = this.serialize(tags1);
			var tags2 = this.serialize(tags2);
			
			var merged = {};
			
			for(k in tags1) {
				if(tags2[k] || (k.charAt(0)=='_')) {
					merged[k] = _.merge(tags1[k],tags2[k]);
				}
			}
			
			for(k in tags2) {
				if(!merged[k]) {
					merged[k] = tags2[k];
				}
			}
			
			for(k in merged) {
				if(!merged[k].points) {
					merged[k].points = [{}];
				}
				if(!merged[k]._values) {
					merged[k]._values = [];
				}
				for(tk in merged[k]) {
					if(merged[k][tk]=="true") { merged[k][tk] = true; }
					if(merged[k][tk]=="false") { merged[k][tk] = false; }
					if(tk=='type') { merged[k][tk] = parseInt(merged[k][tk]); }
				}
			}
			
			//var merged = jQuery.extend(tags1,tags2);
			var merged = this.unserialize(merged);
			
			return merged;
			
		},
		
		serialize: function(tags) {
			//console.log('serializing:');
			//console.log(tags);
			var serialized = {
				wants: [],
				offers: []
			};
			for(var i=0; i < tags.length; i++) {
				if(tags[i].reverse) {
					serialized.wants[tags[i].name] = tags[i];	
				} else {
					serialized.offers[tags[i].name] = tags[i];
				}
				
			}
			//console.log('serialized:');
			//console.log(serialized);
			return serialized;
		},
		
		unserialize: function(tags) {
			//console.log('unserializing:');
			//console.log(tags);
			var unserialized = [];
			for(k in tags) {
				unserialized.push(tags[k]);
			}
			//console.log('unserialized:');
			//console.log(unserialized);
			return unserialized;
		}
		
	}
}]);
