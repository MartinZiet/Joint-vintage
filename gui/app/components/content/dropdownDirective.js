angular.module('joint.directives')
.directive('dd', function ()
  {
    return {
      restrict: 'E',
      templateUrl: 'app/components/content/templates/dropdown.html',
      scope: { 
        cnt: '='
      },
      controller: 'DropDownController'
    };
  })
.directive("ddtree", function($compile) {
    return {
        restrict: "E",
        scope: {
          family: '=',
          cnt: '='
               },
        template: 
            '<li ng-if="family.children.length==0"><a style="margin-left:10px" href="#" ng-click="copy(cnt,family)" >{{ family.name }}</a></li>'+
            '<li ng-if="family.children.length>0" ng-class="{open:flag , dropdownsubmenu:true}">'+
              '<a style="margin-left:10px" ng-click="copy(cnt,family)">{{ family.name }}</a>'+
              '<a style="float: right; margin-right: 10px;" href="#" ng-click="click($event)" ><b class="caret"></b></a>'+
              '<ul class="dropdown-menu">'+
                '<li ng-repeat="child in family.children">'+
                  '<ddtree cnt="cnt" family="child" ><\ddtree>'+
                '</li>'+
              '</ul>'+
            '</li>',
        compile: function(tElement, tAttr) {
            var contents = tElement.contents().remove();
            var compiledContents;
            return function(scope, iElement, iAttr) {
                if(!compiledContents) {
                    compiledContents = $compile(contents);
                }
                compiledContents(scope, function(clone, scope) {
                         iElement.append(clone); 
                });
            };
        },
//        controller: 'DDTreeController'
        controller: function($scope,Restangular){
          
          $scope.copy = function(cnt,family){
            console.log(family);
            var cnt_temp = angular.copy(cnt);
            cnt_temp.id = undefined;
            cnt_temp.parent_id = family.id;
            family.route = "objects";
            Restangular.restangularizeElement(family,cnt_temp,'contents');
			cnt_temp.save().then(function(obj){
              cnt_temp.id = obj.id;
			});
          }
          $scope.click = function(event){
            event.preventDefault(); 
            event.stopPropagation(); 
            $scope.flag= !$scope.flag;
          }
        }
    };
});