angular.module('joint.ctrl')
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
})
.controller('JointObjectMatchController',[
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	function($scope,$stateParams,Restangular,$sce){
		
		var _this = this;
		
		$scope.tabs = [
			{id:'offers',heading:'Offers'},
			{id:'wants',heading:'Wants'}			
		];
		
		$scope.$watch('flipped',function(n,o){
			if(!n) { return false; }
			/*Restangular.all('templates/1').getList().then(function(contents){
				var templateDefinition = contents[0];
				templateDefinition.fields = _.map(templateDefinition.fields,function(f){
					f.field_tpl = 'app/components/object/templates/fields/'+f.type+'.html';
					return f;
				});
				$scope.objTpl = templateDefinition;
			});*/
			
			/*Restangular.all('gumtree').getList().then(function(gumtree) {
				$scope.gumtree = gumtree;
			});
			
			Restangular.all('gcategories').getList().then(function(categories) {
				$scope.categories = categories;
			});*/
		});
		
		$scope.update = function() {
			//console.log($scope.cat);
			$scope.objTpl = {fields: []};
			for(i in $scope.cat) {
				if($scope.cat[i].params) {
					var fields = $scope.cat[i].params;
					_.map(fields,function(f) {
						if(!f.values.length) {
							f.field_tpl = 'app/components/object/templates/fields/text.html';
						} else {
							f.field_tpl = 'app/components/object/templates/fields/select.html';
						}
					});
					$scope.objTpl = {fields: $scope.cat[i].params};
					console.log($scope.cat[i]);
				}
			}
		}
	
}]);