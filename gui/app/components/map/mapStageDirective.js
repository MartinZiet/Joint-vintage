angular.module('joint.directives')
.directive('mapStage',['MapGeometry',function(){
	return {
		controller: 'MapStageController',
		template: '<div ng-repeat="obj in structure" structure-ctrl="structureCtrl" joint-object on-finish-render="ngRepeatFinished" on-fullscreen="rendered" objects-map="objectsMap" obj="obj" object-id="objectId"></div>',			
		link: function(scope, element, attrs) {				
							
		}
	}
}]);