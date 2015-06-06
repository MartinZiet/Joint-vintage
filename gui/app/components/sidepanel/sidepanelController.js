angular.module('joint.ctrl')

	.controller('SidepanelController',['$rootScope','$scope','Restangular','$stateParams','JointGlobalService',
	function($rootScope, $scope, Restangular, $stateParams, global){
		
		$scope.sessionData = global.getLoginState();
		
		if($stateParams.objectId) {
			$scope.objectId = $stateParams.objectId;
		}
		
		$rootScope.$on('$stateChangeSuccess',function() {
			$scope.objectId = $stateParams.objectId;
		});
		
		$scope.$watch('objectId',function(n,o){
			if(!$stateParams.friendId) {
				$scope.load('friends');
			}
		});
		
		$rootScope.$on('sidepanel.refresh',function(){
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
			},
			{
				id:'notifications',
				heading:'Notifications',
				templateUrl: 'app/components/sidepanel/templates/tab-notifications.html'
			}
		];
		
		activate();
		
		function activate() {
			
			Restangular.extendModel('friends',function(model){
				
				model.friendship = function() {
					return model.customPOST({},'friendship').then(function(){
						$rootScope.$broadcast('sidepanel.refresh');
					});					
				}
				
				model.unfriend = function() {
					return model.customDELETE('friendship').then(function(){
						$rootScope.$broadcast('sidepanel.refresh');
					});					
				}
				
				model.chat = function(message) {
					if(!message) {
						return model.getList('chat');
					} else {
						return model.customPOST({message:message},'chat');
					}
				}
				
				return model;
				
			});
			
			$rootScope.$on('notifications.new',function(){
				console.log('new notifications!');
				notifications($scope.notifications);
				//console.log($scope.notifications);
			});
			
			$rootScope.$on('notifications.initial',function(){
				console.log('initial notifications!');
				//notifications(n);
			});
			
		}
		
		function notifications(notif) {
			if(!notif || !notif.length) { return; }
			for(var i=0;i<notif.length;i++) {
				if(notif[i].is_new) {
					toastr.info(notif[i].k);
					$scope.notification(notif[i]);
				}
			}
		}
		
		$scope.notification = function(n,action) {
			
			console.log(n);
			
			var k = n.type;
			if(action) { k += '-' + action; } 
			
			var obj = Restangular.one('objects',n.recipient).one('friends',n.sender);
			
			switch(k) {
				case 'offerfriendship-confirm':
					obj.friendship();
				break;
				case 'offerfriendship-deny':
					obj.unfriend();
				break;
				case 'chatmessage':	$rootScope.$broadcast('chat.update',n,obj);	break;
				case 'confirmfriendship':	$rootScope.$broadcast('sidepanel.refresh');	break;
				case 'removefriendship':	$rootScope.$broadcast('sidepanel.refresh');	break;
				//case 'confirmfriendship': break;
			}
		}
		
		$scope.select = function(id) {
			$scope.load(id);
		}
		
		$scope.byAlias = function(friends) {
			
			//console.log(friends);
			//return friends;
			
			var grouped = {};
			for(var i=0; i<friends.length;i++) {
				var alias_id = friends[i].alias_id;
				if(!grouped[alias_id]) {
					grouped[alias_id] = {
						id: alias_id,
						name: friends[i].alias,
						objects: []
					}
				}
				grouped[alias_id].objects.push(friends[i]);
			}
			return grouped;
		}
		
		$scope.load = function(id) {
			
			if(!$scope.objectId) { return false; }			
			
			switch(id) {
				case 'friends':
					Restangular.one('objects',$scope.objectId).all('friends').getList().then(function(friends){
						friends = $scope.byAlias(friends);						
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
        
        $scope.chat = function(obj) {
        	$rootScope.$broadcast('conversations.add',obj);
        }
		
	}]);
