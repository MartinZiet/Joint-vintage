angular.module('joint.services')

	.factory('DirectivePublicApi',[function(){
		
		return {
			isClient: function(fn,apiPath,$scope) {
				$scope[fn] = function(id,method,params) {
					var req = {id:id,method:method,params:params}
					$scope.$broadcast('apiEvent.'+apiPath,req);
					return req.result;
				}
			},
			isServer: function(apiPath,$scope) {
				$scope.$on('apiEvent.'+apiPath,function(event,req){
					if(!req.result) { req.result = []; }
					if(req.id && $scope.obj.id && $scope.obj.id != req.id) { return false; }
					var result = $scope[req.method].call($scope,req.params);
					if(req.id) { req.result = result; return; }
					if(!req.id && $scope.obj.id) { req.result[$scope.obj.id] = result; return; }
					req.result.push(result);
				});
			}
		}
		
	}]);