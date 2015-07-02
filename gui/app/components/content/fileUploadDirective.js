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
                $scope.aaa = "You tutaj aaa!!!";
                $scope.options = {
                    url: $scope.url,
                    dropZone: $element,
                    maxFileSize: $scope.sizeLimit,
                    autoUpload: $scope.autoUpload
                    };
                $scope.loadingFiles = true;
                
                var addDestroyMethod = function(list){
                    angular.forEach(list, function(item){
                        item.destroy = function(){
                            console.log("destroy object item and refresh");
                        }
                    });
                }
                
                Restangular.one("objects",$stateParams.objectId).customGET("contents")
                        .then(function(items){
                            angular.forEach(items,function(item){
                                if(item.id == $scope.cnt.id){
                                    $scope.loadingFiles = false;
                                    $scope.uploaded_files = item.tags.files;
                                    addDestroyMethod($scope.uploaded_files);
                                }
                            });
                    });
                
                
                
                
                $http.get($scope.url)
                    .then(
                        function (response) {
//                            console.log("get from storage");
//                            console.log(response.data);
//                            $scope.loadingFiles = false;
//                            $scope.queue = response.data.files || [];
                        },
                        function () {
                            $scope.loadingFiles = false;
                        }
                    );
                
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
//                $scope.$on('fileuploadadd', function(event, obj){
//                    console.log('--------------------fileuploadadd--------------------');
//                    console.log( event);
//                    console.log( obj);
//                });
//                
//                $scope.$on('fileuploadprocessdone', function(event, obj){ 
//                    console.log('----------------fileuploadprocessdone--------------------');
//                    console.log( event);
//                    console.log( obj);
//                });
                
                if(!$scope.cnt.tags) {
                    $scope.cnt.tags = {
                        content_type: 'html'
                    }
                }
                
                $scope.$on('fileuploaddone', function(evt,param) {
//                    console.log("fileuploaddone");
					handleUpload(param.result.files);
				});
                
                function handleUpload(files) {
//                    console.log("Directive::handleUpload(files)");
                    if(!$scope.cnt.tags.files) { $scope.cnt.tags.files = []; }
                    for(var i=0; i < files.length; i++) {
                        $scope.cnt.tags.files.push(files[i]);
                    }
                }
                
                function save() {
                    console.log("Directive::save");
                    if(!$scope.cnt.parent_id) { $scope.cnt.parent_id = $stateParams.objectId; }
                    if(!$scope.cnt.type) { $scope.cnt.type = 7; }

//                    console.log($scope.obj);
//                    console.log($scope.cnt);

                    Restangular.restangularizeElement($scope.obj,$scope.cnt,'contents');
                    $scope.cnt.save().then(function(obj){
                        console.log("Directive::$scope.cnt.save()");
                        console.log(obj);
                        $scope.cnt.id = obj.id;
                    });
                }
                
                $scope.$on("$destroy", function(){
                    save();
                });
            }
        }
    }]);
            