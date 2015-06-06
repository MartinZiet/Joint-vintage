angular.module('joint.ctrl')

.controller('JointController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService','$http', 
function($rootScope, $scope, $state, Restangular, $timeout, $global, $http){
	
	var interval = false;	
	var initial = true;
	var notifications = [];
	
	activate();
	
	function activate() {
		
		setupInterval();
		
	}
	
	function reset() {
		for(var i=0; i<notifications.length;i++) {
			notifications[i].is_new = false;
		}
	}
	
	function process(info) {
		
		var inLength = notifications.length;
		
		reset();
				
		for(var i in info) {
			var data = info[i];
			if(data.length > 0 ) {
				for(var j=0; j < data.length; j++) {
					var n = data[j];
					n.type = i;
					var k = n.type+'-'+n.recipient+'-'+n.sender;
					n.k = k;
					var exists = _.find(notifications,{id:n.id});
					if(!exists) {
						n.is_new = true;
						notifications.push(n);
					}	
				}						
			}
		}
		
		var outLength = notifications.length;
		
		if(outLength > inLength) {
			$scope.notifications = notifications;
			if(initial) {
				$rootScope.$broadcast('notifications.initial');
				initial = false;
			} else {
				$rootScope.$broadcast('notifications.new');
			}
		}
				
	}
	
	function setupInterval() {	
		
		if(interval) { return true; }
		
		if($global.loginState && $global.loginState.api) {
			var apiPath = $global.loginState.api.url;
		}
		
		if(!apiPath) { return false; }
		
		var interval = setInterval(function(){
			$http.get(apiPath+'/info').success(function(info){				
				if(info.status) {
					process(info.data);
				}
			});			
		},2000);
		
	}
	
}]);