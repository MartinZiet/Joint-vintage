angular.module('joint.directives')

    .directive('ngUploadForm', ['$rootScope', 'fileUpload', '$http', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/content/templates/fileform.html',
            scope: {
                allowed: "@",
                url: "@",
                autoUpload: "@",
                sizeLimit: "@",
                queue2: "@",
                cnt: "=",
                obj: "="
            },
            controller: function($scope, $element, fileUpload, $http, $stateParams,Restangular,$timeout) {
                    $scope.options = {
                    url: $scope.url,
                    dropZone: $element,
                    maxFileSize: $scope.sizeLimit,
                    autoUpload: $scope.autoUpload
                    };
                $scope.loadingFiles = true;
                console.log(fileUpload);
                var addDestroyMethod = function(list){
                    angular.forEach(list, function(item){
                        item.destroy = function(){
                            console.log("destroy object item and refresh");
                        }
                    });
                }
                
                $scope.rest_obj = Restangular.one("objects",$stateParams.objectId);
                $scope.rest_obj.customGET("contents").then(function(items){
                            angular.forEach(items,function(item){
                                if(item.id == $scope.cnt.id){
                                    $scope.loadingFiles = false;
                                    $scope.uploaded_files = item.tags.files;
                                    addDestroyMethod($scope.uploaded_files);
                                }
                            });
                    });
                
                
                
                
                
                
//                Events list fired by blueimp.fileupload:
                
//                'fileuploadadd',
//                'fileuploadsubmit',
//                'fileuploadsend',
//                'fileuploaddone',
//                'fileuploadfail',
//                'fileuploadalways',
//                'fileuploadprogress',
//                'fileuploadprogressall',
//                'fileuploadstart',
//                'fileuploadstop',
//                'fileuploadchange',
//                'fileuploadpaste',
//                'fileuploaddrop',
//                'fileuploaddragover',
//                'fileuploadchunksend',
//                'fileuploadchunkdone',
//                'fileuploadchunkfail',
//                'fileuploadchunkalways',
//                'fileuploadprocessstart',
//                'fileuploadprocess',
//                'fileuploadprocessdone',
//                'fileuploadprocessfail',
//                'fileuploadprocessalways',
//                'fileuploadprocessstop'
//              $scope.$on('fileuploaddone', function(event, obj){
//                    console.log('--------------------fileuploaddone--------------------');
//                    console.log( event);
//                    console.log( obj);
//                });
//              
                if(!$scope.cnt.tags) {
                    $scope.cnt.tags = {
                        content_type: 'html'
                    }
                }
                
                $scope.$on('fileuploaddone', function(evt,param) {
                    handleUpload(param.result.files);
				});
                
                function handleUpload(files) {
                  
                    if(!$scope.cnt.tags.files) { $scope.cnt.tags.files = []; }
                    for(var i=0; i < files.length; i++) {
                        $scope.cnt.tags.files.push(files[i]);
                    }
                }
                
                function save() {
                    console.log("Directive::save");
                    if(!$scope.cnt.parent_id) { $scope.cnt.parent_id = $stateParams.objectId; }
                    if(!$scope.cnt.type) { $scope.cnt.type = 7; }

                    console.log("------------------>>>>>>>>>>>> ");
                    console.log($scope.obj);
                    console.log($scope.cnt);

                    Restangular.restangularizeElement($scope.obj,$scope.cnt,'contents');
                    $scope.cnt.save().then(function(obj){
                        $scope.cnt.id = obj.id;
                    });
                }
                
                $scope.$on("$destroy", function(){
                    save();
                });
            }
        }
    }]);
            