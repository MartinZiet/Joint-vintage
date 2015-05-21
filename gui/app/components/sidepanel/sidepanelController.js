angular.module('joint.ctrl')

	.controller('SidepanelController',['$scope','Restangular',function($scope, Restangular){
		
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
			switch(id) {
				case 'friends':
					Restangular.all('friends').getList().then(function(friends){
						//console.log(friends);
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
