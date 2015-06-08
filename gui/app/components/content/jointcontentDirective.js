angular.module('joint.directives')

    .directive('jointcontent',   ['$http','JointTags' ,function ($http,JointTags)
    {
        return {
        	template: '<div ng-include="tpl"></div>',
            restrict: 'E',
            scope: {
            	obj: '=',
            	cnt: '=',
            	remove: '='
            },
            controller: 'jointcontentController',
            link: function (scope, elm, attrs)
            {
            	
            	scope.tpl = 'app/components/content/templates/content.html';
            	
            	jQuery(function($){
			    $("[contenteditable]").focusout(function(){
			        var element = $(this);        
			        if (!element.text().replace(" ", "").length) {
			            element.empty();
			        }
			    });
			});
            	
            	
            }
        };

    }]);