angular.module('joint.ctrl')
	.controller('NavbarController',['$scope','$state','$window','JointGlobalService','Restangular','$stateParams',
	function($scope, $state,$window,$global,restangular,$stateParams){
        console.log('NavbarController');
        
        $scope.goToParent = function(){
            restangular.one("objects", $stateParams.objectId).get()
                .then(function(obj){
                    if(obj!==undefined)
                        $state.go('me.objects',{objectId: obj.parent_id});
                });
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