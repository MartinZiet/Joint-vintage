angular.module('joint.ctrl')

	.controller('NavbarController',['$scope','$state','$window','JointGlobalService',
	function($scope, $state,$window,$global){
        console.log('NavbarController');
        
        $scope.goToParent = function(){
            console.log('goToParent');
        }
        
        $scope.goBack = function(){
            $window.history.back();
        }
        
        $scope.goHome = function(){
            $state.go('me.objects',{objectId: $global.getLoginState().object_id});
        }
        
        $scope.goForward = function(){
            $window.history.forward();
        }
    }]);