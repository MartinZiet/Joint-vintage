angular.module('joint.directives')

    .directive('jointpopup',   ['$http' ,function ($http)
    {
        return {
        	template: '<div ng-include="tpl"></div>',
            restrict: 'E',
            link: function (scope, elm, attrs)
            {
            	scope.tpl = attrs.tpl;
            	console.log(attrs);
            	
            }
        };

    }]);