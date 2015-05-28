angular.module('joint.services')

.factory('JointTags',[function(){
	return {
		
		dataTypes: function() {
			
			return {
				hidden: {
					name: 'Hidden',
					icon: 'cog',
					templateUrl: 'app/components/object/templates/fields/hidden.html',
					templateUrlTpl: false
				},
				text: {
					name: 'Text input',
					icon: 'terminal',
					templateUrl: 'app/components/object/templates/fields/text.html',
					templateUrlTpl: false
				},
				select: {
					name: 'Select',
					icon: 'terminal',
					templateUrl: 'app/components/object/templates/fields/select.html',
					templateUrlTpl: 'app/components/object/templates/fields/text.html'
				},
				range: {
					name: 'Range',
					icon: 'arrows-h',
					templateUrl: 'app/components/object/templates/fields/range.html',
					templateUrlTpl: 'app/components/object/templates/fields/range.html'
				},
				radio: {
					name: 'Radio select',
					icon: 'check-circle-o',
					templateUrl: 'app/components/object/templates/fields/radio.html',
					templateUrlTpl: 'app/components/object/templates/fields/text.html',
				},
				verb: {
					name: 'Joint Verb',
					icon: 'check-circle-o',
					templateUrl: 'app/components/object/templates/fields/verb_radio.html',
					templateUrlTpl: 'app/components/object/templates/fields/verb.html',
				},
				geo: {
					name: 'Localization',
					icon: 'globe',
					templateUrl: 'app/components/object/templates/fields/geo.html',
					templateUrlTpl: false
				}
			};
			
		},
		
		domains: function() {
			return ['wants','offers','_meta'];
		},
		
		verbModes: function() {
			return {
				1: { name: 'A>B' },
				2: { name: 'B>A' }
			}
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
						tags: [
							{
								name: '_verb',
								domain: '_meta',
								type: 'verb',
								_values: []
							}
						]
					}
				break;
				
				case 'tag':
					return {
						type: 'select',
						_values: []
					}
				break;
				
				case 'point':
					return {};
				break;
				
			}
			
		},
		
		fromTemplate: function(tplTags,objTags) {
			
			//get template tags
			var tags = angular.copy(tplTags.tags);
						
			tags = _.merge(tags,objTags.tags);
						
			for(i in tags) {
				if(!tags[i].points) {
					tags[i].points = [{}];
				}
				if(!tplTags.tags[i]) {
					delete tags[i];
				}
			}
			
			return {_meta: objTags._meta, tags: tags};
			
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
		
		serialize: function(tags,type) {
			
			//console.log('serializing:');
			//console.log(tags);
			var serialized = {};
			
			for(k in tags) {
				for(var i=0; i < tags[k].length; i++) {
					if(!serialized[k]){
						serialized[k] = {};
					}
					serialized[k][tags[k][i].name] = tags[k][i];	
				}
			}
			
			if(tags._meta) {
				serialized._meta = tags._meta;
			}
			//console.log('serialized:');
			//console.log(serialized);
			return serialized;
		},
		
		enforceBoolean: function(arr) {
			for(k in arr) {
				if(arr[k]==='true') { arr[k] = true; }
				if(arr[k]==='false') { arr[k] = false; }
			}
			return arr;
		},
		
		unserialize: function(tags) {
			//console.log('unserializing:');
			//console.log(tags);
			var unserialized = { tags: {} };
			for(k in tags) {
				if(k == '_meta') {
					unserialized[k] = tags[k];
				} else {
					for(tag in tags[k]) {
						if(tags[k][tag].type=='select' && tags[k][tag] && tags[k][tag].points) {
							var points = [{value:[]}];
							for(var v=0;v<tags[k][tag].points.length; v++) {
								if(tags[k][tag].points[v].value) {
									points[0].value.push(tags[k][tag].points[v].value);
								}
							}							
							tags[k][tag].points = points;
						}
						unserialized['tags'][tag] = tags[k][tag]; //.push(tags[k][tag]);
					}
				}
			}
			//console.log('unserialized:');
			//console.log(unserialized);
			return unserialized;
		},
		
		convertToArray: function(tags) {
			var converted = [];
			for(k in tags) {
				converted.push(tags[k]);
			}
			return converted;
		},
		
		serializeAsIntention: function(scope) {
			
			var verbMode = scope.verb_mode;
			var tags = angular.copy(scope.current.tags);
			
			console.log('serializeAsIntention verbMode:'+verbMode);
			
			var serialized = {};
			
			for(var i in tags) {
				var k = 'offers';
				if(verbMode==1 && !tags[i].reverse) { var k = 'wants'; }
				if(verbMode==2 && tags[i].reverse) { var k = 'wants'; }
				if(!serialized[k]) { serialized[k] = {}; }
				delete tags[i]._values;
				for(p in tags[i].points) {
					if(tags[i].points[p].value instanceof Array) {
						var pointValuesArray = [];
						for(v in tags[i].points[p].value) {
							pointValuesArray.push({value: tags[i].points[p].value[v]});
						}
						tags[i].points = pointValuesArray;
					}
					if(tags[i].points[p].from && !tags[i].points[p].to) {
						tags[i].points[p].to = tags[i].points[p].from;
					}
				}
				if(tags[i].name != '_verb' && tags[i].points && tags[i].points.length > 0) {
					serialized[k][tags[i].name] = tags[i];
				}
			}
			
			serialized._meta = scope.current._meta;
			
			//if verb_mode==1 && !t.reverse -> wants else offers
			//if verb_mode==2 && t.reverse -> wants else offers			
			
			console.log(serialized);
			
			return serialized;
			
		}
		
	}
}]);
