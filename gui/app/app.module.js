// Declare app level module which depends on views, and components
angular.module('joint.ctrl',[]);
angular.module('joint.services',[]);
angular.module('joint.directives',[]);

angular.module('joint', [
  'ui.router',    
  'ui.bootstrap',
  'ui.select',
  'restangular',
  'ngBootbox',
  'joint.ctrl',
  'joint.services',
  'joint.directives',
  'ContentEditable'
])

.config(function(RestangularProvider){
	RestangularProvider.setBaseUrl('../stuff/api-mockup.php');
	RestangularProvider.setMethodOverriders(['DELETE','PUT']);
})

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/me");
  //
  // Now set up the states
  $stateProvider
  	.state('login', {
  		url: "/login",
  		templateUrl: "app/views/login.html"
  	})
    .state('me', {
      url: "/me",
      templateUrl: "app/views/map.html"    
    })
    .state('me.object', {
      url: "/object/:objectId"
    })
    .state('me.object.edit', {
    	url: "/edit",
    	params: {
    		editObject: true
    	}
    })
    .state('friends', {
      url: "/friends/:friendId/object/:objectId",
      templateUrl: "app/views/map.html"
    });
});