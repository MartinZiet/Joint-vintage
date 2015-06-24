angular.module('joint.directives')

    .directive('jointupload',   ['$http' ,function ($http)
    {
        return {
        	templateUrl: 'app/components/content/templates/uploader.html',
            restrict: 'E',
            scope: {
            	file: '='
            },
            link: function (scope, elm, attrs)
            {
            	
            	scope.$on('fileuploaddone', function(evt,param) {	
            		var files = param.result.files;
            		for(var i=0; i < files.length; i++) {
						scope.file = files[i].thumbnailUrl;
					}						
					console.log(scope);				
				});
            	
            
            }
        };

    }]);