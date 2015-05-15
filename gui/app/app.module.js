// Declare app level module which depends on views, and components
angular.module('joint.ctrl',[]);
angular.module('joint.services',[]);
angular.module('joint.directives',[]);

angular.module('joint', [
  'ui.router',    
  'ui.bootstrap',
  'restangular',
  'joint.ctrl',
  'joint.services',
  'joint.directives',
])

.config(function(RestangularProvider){
	RestangularProvider.setBaseUrl('/sandbox/angular/api.php');
	RestangularProvider.setMethodOverriders(['DELETE','PUT']);
})

.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/me");
  //
  // Now set up the states
  $stateProvider
    .state('me', {
      url: "/me",
      templateUrl: "app/views/map.html",      
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
    .state('me.object.add', {
    	url: "/add",
    	params: {
    		addObject: true
    	}
    })
    .state('friends', {
      url: "/friends/:friendId/object/:objectId",
      templateUrl: "app/views/map.html"
    });
});