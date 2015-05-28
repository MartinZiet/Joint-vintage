angular.module('joint.directives')
.directive('fieldGeo',function($compile){
	return {
		scope: {
			ngModel: '='
		},
		templateUrl: 'app/components/object/templates/fields/geo.directive.html',
		link: function(scope,element,attrs) {
			
			scope.locationPopup = function() {
				bootbox.dialog({
					title: 'Wybierz lokalizację',
					message: '<input type="text" class="form-control" id="location-picker-address" /><div id="location-picker-map"></div>',
					callback: function() {
						scope.ngModel.address = jQuery('#location-picker-address').val();
					}
				});
				setTimeout(function() { 
					jQuery('#location-picker-map').locationpicker({
						location: {
							latitude: scope.ngModel.lat,
							longitude: scope.ngModel.lng
						},
						radius: scope.ngModel.radius,
						zoom: 10,
						inputBinding: {
							latitudeInput: element.find('[ng-model="ngModel.lat"]'),
							longitudeInput: element.find('[ng-model="ngModel.lng"]'),
							radiusInput: element.find('[ng-model="ngModel.radius"]'),
							locationNameInput: jQuery('#location-picker-address')
							//locationNameInput: element.find('[ng-model="ngModel.address"]')
						},
						enableAutocomplete: true,
						onchanged: function(location,radius,markerDropped) {
						}
					});
				},200);
			}
			
		}
	}
});