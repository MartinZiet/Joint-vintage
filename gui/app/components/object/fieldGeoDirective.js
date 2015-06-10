angular.module('joint.directives')
.directive('fieldGeo',function(JointPopup){
	return {
		scope: {
			ngModel: '='
		},
		templateUrl: 'app/components/object/templates/fields/geo.directive.html',
		link: function(scope,element,attrs) {
			
			scope.locationPopup = function() {
				JointPopup.show({
					scope: scope,
					templateUrl:'app/components/object/templates/fields/geo.directive.modal.html',
					link: function() {
						var cfg = {
							zoom: 10,
							inputBinding: {
								latitudeInput: element.find('[ng-model="ngModel.lat"]'),
								longitudeInput: element.find('[ng-model="ngModel.lng"]'),
								radiusInput: jQuery('#location-picker-radius'),
								locationNameInput: jQuery('#location-picker-address')
								//locationNameInput: element.find('[ng-model="ngModel.address"]')
							},
							enableAutocomplete: true,
							onchanged: function(location,radius,markerDropped) {
								element.find('[ng-model="ngModel.radius"]').val(radius).trigger('input');
								var address = jQuery('#location-picker-address').val();
								element.find('[ng-model="ngModel.address"]').val(address).trigger('input');
							}
						};
						if(scope.ngModel.lat && scope.ngModel.lng) {
							cfg.location = {
								latitude: scope.ngModel.lat,
								longitude: scope.ngModel.lng
							};
						}
						if(scope.ngModel.radius) {
							cfg.radius = scope.ngModel.radius;
						}
						jQuery('#location-picker-map').locationpicker(cfg);
					}
				});
		
			}
			
		}
	}
});