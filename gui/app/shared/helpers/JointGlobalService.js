angular.module('joint.services')

.service('JointGlobalService', ['$state','Restangular','localStorageService',function($state,Restangular,local) {
	
	var $this = this;
	
	$this.loginState = $.extend({status:false,initialized:false},local.get('loginState'));
	
	this.api = function(api) {
		$this.loginState.api = api;
		local.set('loginState',$this.loginState);
	}
	
	this.login = function(obj) {
		var prevApi = $this.loginState.api;
		$this.loginState = obj;
		$this.loginState.status = true;
		$this.loginState.api = prevApi;
		local.set('loginState',$this.loginState);
	}
	
	this.getLoginState = function() {
		return local.get('loginState');
	}
	
	this.checkLogin = function() {
		
		if($this.loginState.api) {
			Restangular.setBaseUrl($this.loginState.api.url);
		}
		
		if(!$this.loginState.initialized) {
			return Restangular.all('session').doGET().then(function(resp) {
				$this.loginState.initialized = true;
				if(resp && resp.object_id) {
					$this.loginState.status = true;
				}
				return $this.redirectIfNotLoggedIn();		
			});
		} else {
			return $this.redirectIfNotLoggedIn();
		}
		
	}
	
	this.redirectIfNotLoggedIn = function() {
		
		if(!$this.loginState || !$this.loginState.status) {
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