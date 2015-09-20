angular.module('joint.ctrl')
.controller('DropDownController',[
	'$scope',
	'$stateParams',
	'Restangular',
    'dropList',
	function($scope,$stateParams,Restangular, dropList){
      dropList.getList.then(function(list){
        $scope.dropList = list["0"];
      });
}]);