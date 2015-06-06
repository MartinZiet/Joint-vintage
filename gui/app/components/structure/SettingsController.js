angular.module('joint.ctrl')

.controller('SettingsController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService','$http', 
function($rootScope, $scope, $state, Restangular, $timeout, $global, $http){
	
	var vm = this;
	
	vm.add = add;
	vm.save = save;
	vm.cancel = cancel;
	vm.remove = remove;
	vm.removeCommit = removeCommit;
	
	vm.isDirty = false;
	vm.pickReplacement = false;
	
	var queue = {};
	
	activate();
	
	function activate() {
		getAliases();
	}
	
	function getAliases() {
		Restangular.all('aliases').getList().then(function(aliases){
			vm.aliases = aliases;
		});
	}
	
	function add() {
		var obj = {}
		queue.obj = obj;
		vm.aliases.push(queue.obj);
		vm.isDirty = true;
	}
	
	function save() {
		vm.isDirty = false;
		Restangular.all('aliases').post(queue.obj).then(function(){
			getAliases();
			queue = {};
			vm.isDirty = false;
		});
	}
	
	function remove(obj) {
		queue.obj = obj;
		vm.pickReplacement = true;
		vm.queue = queue;
	}
	
	function removeCommit(id) {
		queue.obj.remove({replaceId:id}).then(function(){
			vm.aliases = _.without(vm.aliases,queue.obj);
			queue = {};
			vm.pickReplacement = false;
		});
	}
	
	function cancel() {
		getAliases();
		vm.isDirty = false;
	}
	
}]);