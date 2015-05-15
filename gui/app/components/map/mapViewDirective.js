angular.module('joint.directives')

.directive('mapView',function(){
	return {		
		template: '<div map-viewport ng-class="{ready:ready}"></div>',	
		controller: 'MapViewController',
		link: function($scope, $element, $attr, MapViewController) {
			
		}
	}
});