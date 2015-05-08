angular.module('joint.ctrl')

	.controller('SidepanelController',['$scope','Restangular',function($scope, Restangular){
		
		$scope.tabs = [
			{
				id:'friends',
				heading:'Przyjaciele',
				active: true,
				templateUrl: 'app/components/sidepanel/templates/tab-friends.html'
			},
			{
				id:'searches',
				heading:'Szukacze',
				templateUrl: 'app/components/sidepanel/templates/tab-searches.html'
			}
		];
		
		$scope.select = function(id) {
			$scope.load(id);
		}
		
		$scope.load = function(id) {
			switch(id) {
				case 'friends':
					$scope.list = {
						template: 'app/components/sidepanel/templates/list-friend.html',
						friends: Restangular.all('friends').getList().$object
					}
				break;
				case 'searches': 
					$scope.searches = Restangular.all('friends').getList().$object;
				break;
			}
		}
		
	}]);
