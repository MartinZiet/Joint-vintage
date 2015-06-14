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
					title: 'Location picker',
					link: function() {						
						var interval = setInterval(function(){
							if(jQuery('#location-picker-map').length>0) {
								clearInterval(interval);
								var cfg = {
									zoom: 10,
									inputBinding: {
										latitudeInput: jQuery('#location-picker-lat'),
										longitudeInput: jQuery('#location-picker-lng'),
										radiusInput: jQuery('#location-picker-radius'),
										locationNameInput: jQuery('#location-picker-address')
										//locationNameInput: element.find('[ng-model="ngModel.address"]')
									},
									enableAutocomplete: true,
									onchanged: function(location,radius,markerDropped) {								
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
						},100);						
					},
					success: function() {
						
						var inputBinding = {
							latitudeInput: jQuery('#location-picker-lat'),
							longitudeInput: jQuery('#location-picker-lng'),
							radiusInput: jQuery('#location-picker-radius'),
							locationNameInput: jQuery('#location-picker-address')
							//locationNameInput: element.find('[ng-model="ngModel.address"]')
						};
						
						var lat = inputBinding.latitudeInput.val();
						var lng = inputBinding.longitudeInput.val();
						var radius = inputBinding.radiusInput.val();
						var location = inputBinding.locationNameInput.val();
						
						element.find('[ng-model="ngModel.lat"]').val(lat).trigger('input');
						element.find('[ng-model="ngModel.lng"]').val(lng).trigger('input');
						element.find('[ng-model="ngModel.radius"]').val(radius).trigger('input');								
						element.find('[ng-model="ngModel.address"]').val(location).trigger('input');
						
					}
				});
		
			}
			
		}
	}
});