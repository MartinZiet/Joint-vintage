angular.module('joint.directives')

    .directive('prettyphoto',   ['$http' ,function ($http)
    {
        return function(scope, element, attrs) {
		    $("[rel^='prettyPhoto']").prettyPhoto({deeplinking: false, social_tools: false});
		};

    }]);