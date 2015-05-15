angular.module('joint.directives')
.directive('fieldGeo',function($compile){
	return {
		scope: {
			lat: '&',
			lng: '&',
			radius: '&',
			address: '&'
		},
		templateUrl: 'app/components/object/templates/fields/geo.directive.html',
		link: function(scope,element,attrs) {
			
			scope.locationPopup = function() {
				bootbox.dialog({
					title: 'Wybierz lokalizację',
					message: '<div id="location-picker-map"></div>'
				});
				setTimeout(function() { 
					jQuery('#location-picker-map').locationpicker({
						locationName: 'Warsaw, Poland',
						inputBinding: {
							latitudeInput: element.find('[ng-model="lat"]'),
							longitudeInput: element.find('[ng-model="lng"]'),
							radiusInput: element.find('[ng-model="radius"]'),
							locationNameInput: element.find('[ng-model="address"]')
						}
					});
				},200);
			}
			
		}
	}
});