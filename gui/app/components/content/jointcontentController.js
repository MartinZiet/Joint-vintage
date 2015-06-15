angular.module('joint.ctrl')

.controller('jointcontentController',[
	'$rootScope',
	'$scope',
	'$stateParams',
	'Restangular',
	'$sce',
	'JointTags',
	function($rootScope,$scope,$stateParams,Restangular,$sce,JointTags){
		
		$scope.edit = edit;
		$scope.shared = {
			uploadInterface: {},
			uploadConfigured: false
		};
		
		$scope.logInterface = function(intfc) {
			console.log(intfc);
			console.log($scope.uploadInterface);
		}
		
		$scope.dropFile = dropFile;
		
		activate();
		
		function activate() {
			
			if(!$scope.cnt.tags) {
				$scope.cnt.tags = {
					content_type: 'html'
				}
			}
			
			var contentTypes = JointTags.contentTypes();
            $scope.contentType = contentTypes[$scope.cnt.tags.content_type];
			
			$scope.$watch('editMode',function(n,o){
				if(n) {
					enableUploader();
					$scope.currentTemplateUrl = $scope.contentType.templateUrlEdit;
				} else {
					$scope.currentTemplateUrl = $scope.contentType.templateUrl;
				}
			});
			
			$scope.editMode = false;
			
			if(!($scope.cnt.tags instanceof Object)) {
				$scope.cnt.tags = {};
			}
			if(!$scope.cnt.id) {
				$scope.editMode = true;
			}
			
			$scope.$watch('cnt.tags.content_html',function(n){
				$scope.trustedContentHtml = $sce.trustAsHtml(n);
			});
			
		}
		
		function enableUploader() {
			
			if($scope.contentType.enableUpload && !$scope.shared.uploadConfigured) {
				$scope.$on('fileuploaddone', function(evt,param) {
					if($scope.editMode) {
						handleUpload(param.result.files);
					}
				});
				$scope.shared.uploadConfigured = true;
			}
			
		}
		
		function handleUpload(files) {
			
			if(!$scope.cnt.tags.files) { $scope.cnt.tags.files = []; }
			for(var i=0; i < files.length; i++) {
				$scope.cnt.tags.files.push(files[i]);
			}
			
			$scope.$apply();
			
		}
		
		function save() {
			
			console.log($scope.dropletInterface);
			
			if(!$scope.cnt.parent_id) { $scope.cnt.parent_id = $scope.obj.id; }
			if(!$scope.cnt.type) { $scope.cnt.type = 7; }
			
			Restangular.restangularizeElement($scope.obj,$scope.cnt,'contents');
			$scope.cnt.save().then(function(obj){
				console.log(obj);
				$scope.cnt.id = obj.id;
			});
		}
		
		function edit() {
			if($scope.editMode) {
				$scope.editMode = false;
				save();
			} else {
				$scope.editMode = true;
			}
		}
		
		function dropFile(file) {
			$scope.cnt.tags.files = _.without($scope.cnt.tags.files,file);
		}

	
}]);