/** CONTROLLER **/
angular.module('joint.ctrl')

.controller('Shell', ['$rootScope','$scope','Restangular',
function($rootScope,$scope,Restangular) {

  var vm = this;
  
  vm.username = 'username1';
  vm.sendMessage = sendMessage;
  vm.init = init;
  vm.messages = [];
      
  function activate() {
  	getMessages();
  	$rootScope.$on('chat.update',function(evt,notif){
  		console.log('on chat.update');
  		console.log(notif);
  		console.log(vm.obj.id);
  		if(parseInt(notif.sender)==vm.obj.id) {
  			getMessages();
  		}
  	});
  }
  
  function init(obj) {
  	vm.obj = obj;  	
  	activate();
  }
  
  function getMessages() {
  	vm.obj.chat().then(function(raw){  		
  		startIndex = 0;  	
  		startIndex = vm.messages.length-1;
  		if(startIndex < 0) { startIndex = 0; }
  		for(var i=startIndex; i<raw.length;i++) {
  			pushMessage({username:raw[i].username,content:raw[i].content});
  		}
  	});  	
  }
  
  function pushMessage(msg) {
  	vm.messages.push(msg);
  }  
  
  function sendMessage(message,username) {
  	
  	if(message && message !== '') {
  		vm.obj.chat(message).then(function(raw){
  			console.log(raw);
  			getMessages();
  		});
  	}
  	  	
  }

}]);