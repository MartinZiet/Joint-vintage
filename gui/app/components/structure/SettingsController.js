angular.module('joint.ctrl')

.controller('SettingsController',['$rootScope','$scope', '$state', 'Restangular','$timeout','JointGlobalService','$http','JointPopup', 
function($rootScope, $scope, $state, Restangular, $timeout, $global, $http, JointPopup){
	
	var vm = this;
	
	vm.add = add;
	vm.save = save;
	vm.cancel = cancel;
	vm.remove = remove;
	vm.removeCommit = removeCommit;
	vm.edit = edit;
	
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
	
	function edit(alias) {
		$scope.current = angular.copy(alias);
		JointPopup.show({
			scope: $scope,
			title: 'Edit alias',
			templateUrl: 'app/components/structure/templates/alias.modal.html',
			link: function() {
				
			},
			success: function() {
				alias.alias = $scope.current.alias;
				alias.info = $scope.current.info;
				alias.image = $scope.current.image;
				alias.save();				
			}
		});
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