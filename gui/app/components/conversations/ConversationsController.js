angular.module('joint.ctrl')
.controller('ConversationsController',['$rootScope','$scope',function($rootScope,$scope) {
	
	$rootScope.$on('conversations.add',function(evt,obj){		
		add({name:obj.name,alias:obj.alias_name});
	});
	
	var vm = this;
	
	vm.template = "app/components/conversations/templates/conversation.html";
	vm.close = close;
	vm.minimize = minimize;
	
	vm.conversations = [];
	
	function add(obj) {
		vm.conversations.push(obj);
	}
	
	function close(c) {
		vm.conversations = _.without(vm.conversations,c);
	}
	
	function minimize() {
		
	}
		
}]);