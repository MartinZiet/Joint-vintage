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
        $scope.paste_flag = false;
		
		$scope.logInterface = function(intfc) {
            console.log("$scope.logInterface");
			console.log(intfc);
			console.log($scope.uploadInterface);
		}
		
		$scope.dropFile = dropFile;
		
        $scope.copy = copy_cnt;
        
        $scope.paste = paste_cnt;
        
		activate();
		
		function activate() {
            console.log("activate");
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
            
            $scope.$watch(function(){
                return paste_check();
                }
                ,function(n,o){
                    if(n) {
                        $scope.paste_flag = true;
                    } else {
                        $scope.paste_flag = false;
                    }
                });
			
			$scope.editMode = false;
			
			if(!($scope.cnt.tags instanceof Object)) {
                console.log("tags delete");
				$scope.cnt.tags = {};
			}
			if(!$scope.cnt.id) {
				$scope.editMode = true;
			}
			
			$scope.$watch('cnt.tags.content_html',function(n){
                var ret = n;
                if(n){
                    var pattern = /(\<a\s)/g; //(.+\<\/a\>)
                    ret = n.replace(pattern,'$1 target="_blanc"');
                }
				$scope.trustedContentHtml = $sce.trustAsHtml(ret);
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
                console.log(files[i]);
                $scope.cnt.tags.files.push(files[i]);
			}
			$scope.$apply();
			
		}
		
		function save() {
			
			if(!$scope.cnt.parent_id) { $scope.cnt.parent_id = $scope.obj.id; }
			if(!$scope.cnt.type) { $scope.cnt.type = 7; }
			console.log($scope.cnt.tags);
            Restangular.restangularizeElement($scope.obj,$scope.cnt,'contents');
			$scope.cnt.save().then(function(obj){
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
        
        function copy_cnt(cnt){
            console.log("copy_cnt(cnt)");
            console.log(cnt);
            $rootScope.copy_cnt = cnt;
            $rootScope.copy_cnt.parent_id = undefined;
        }
        
        function paste_cnt() {
            console.log("paste_cnt");
            if( $rootScope.copy_cnt !== undefined){
                console.log($rootScope.copy_cnt);
                $scope.cnt = $rootScope.copy_cnt;
                $rootScope.copy_cnt = undefined;
                var contentTypes = JointTags.contentTypes();
                $scope.contentType = contentTypes[$scope.cnt.tags.content_type];
                $scope.currentTemplateUrl = $scope.contentType.templateUrlEdit;
                $scope.editMode = true;
            }
        }
        
        function paste_check(){
            console.log("paste_check");
            if( $rootScope.copy_cnt !== undefined ){
                return true;
            } else {
                return false;
            }
        }
}]);