angular.module('joint.ctrl')

	.controller('SidepanelController',['$rootScope','$scope','Restangular','$stateParams',
	function($rootScope, $scope, Restangular, $stateParams){
		
		$rootScope.$on('$stateChangeSuccess',function() {
			$scope.objectId = $stateParams.objectId;
		});
		
		$scope.$watch('objectId',function(n,o){
			$scope.load('friends');
		});
		
		$scope.tabs = [
			{
				id:'friends',
				heading:'Friends',
				active: true,
				templateUrl: 'app/components/sidepanel/templates/tab-friends.html'
			},
			{
				id:'searches',
				heading:'Searches',
				templateUrl: 'app/components/sidepanel/templates/tab-searches.html'
			}
		];
		
		$scope.select = function(id) {
			$scope.load(id);
		}
		
		$scope.load = function(id) {
			
			if(!$scope.objectId) { return false; }
			
			switch(id) {
				case 'friends':
					Restangular.one('objects',$scope.objectId).all('friends').getList().then(function(friends){
						$scope.list = {
							template: 'app/components/sidepanel/templates/list-friend.html',
							friends: friends
						}
					});
				break;
				case 'searches': 
					$scope.searches = Restangular.all('friends').getList().$object;
				break;
			}
		}
        
        $scope.call = function(id){
            console.log("calling to " + id);
            }
		
	}]);
