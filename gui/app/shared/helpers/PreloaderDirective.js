angular.module('joint.directives')

    .directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
            	
            	var hidePreloader = ['info'];
            	
                scope.isLoading = function () {
                	var show = false;
                	for(var i=0; i < $http.pendingRequests.length; i++) {
                		for(var j=0; j < hidePreloader.length; j++) {
                            
                			if($http.pendingRequests[i] && $http.pendingRequests[i].url && $http.pendingRequests[i].url.indexOf(hidePreloader[j]) < 0) {
                				var show = true;
                			}
                		}
                	}
                    return show;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.show();
                    }else{
                        elm.hide();
                    }
                });
            }
        };

    }]);