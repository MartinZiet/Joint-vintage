angular.module('joint.ctrl')
.controller('ConversationsController',['$rootScope','$scope',function($rootScope,$scope) {
	
	$rootScope.$on('conversations.add',function(evt,obj){		
		add(obj);
	});
	
	$rootScope.$on('chat.update',function(evt,notif,obj){
		add(obj);
	});
	
	var vm = this;
	
	vm.template = "app/components/conversations/templates/conversation.html";
	vm.close = close;
	vm.minimize = minimize;
	
	vm.conversations = [];
	
	function add(obj) {
		var exists = _.find(vm.conversations,{id:obj.id});
		if(!exists) {
			vm.conversations.push(obj);
		}
	}
	
	function close(c) {
		vm.conversations = _.without(vm.conversations,c);
	}
	
	function minimize() {
		
	}
		
}]);