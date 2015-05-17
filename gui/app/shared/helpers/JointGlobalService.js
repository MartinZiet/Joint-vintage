angular.module('joint.services')

.service('JointGlobalService', ['$state','Restangular',function($state,Restangular) {
	
	this.loginState = {
		status: false
	}
	
	this.checkLogin = function() {
		if(!this.loginState || !this.loginState.status) {
			$state.go('login');
			return false;
		}
		return true;
	}
	
	this.logout = function() {
		this.loginState.status = false;
		$state.go('login');
	}    
	
}]);