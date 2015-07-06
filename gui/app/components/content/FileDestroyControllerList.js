angular.module('joint.ctrl')
.controller('FileDestroyControllerList', ['$scope', '$http', '$q', function ($scope, $http, $q) {
            var file = $scope.file, state;
            $scope.clear = function (files) {
                console.log('clear check');
                console.log(files);
                    var queue = $scope.uploaded_files,
                        i = queue.length,
                        file = files,
                        length = 1;
                    if (angular.isArray(files)) {
                        file = files[0];
                        length = files.length;
                    }
                    while (i) {
                        i -= 1;
                        if (queue[i] === file) {
                            return queue.splice(i, length);
                        }
                    }
                };
    
            if (file.url) {
                file.$state = function () {
                    console.log("state: "+state);
                    return state;
                    };
                file.$destroy = function () {
                    state = 'pending';
                    var promises = [];
                    promises.push($http({
                                url: file.deleteurl,
                                method: file.deletetype
                        }));
                    
                    promises.push($http({
                                url: file.deleteUrl,
                                method: file.deleteType
                        }));
                    promises.push($scope.rest_obj.one("contents",$scope.cnt.id).remove({file:escape(file.name)}))
                    
                    return $q.all(promises).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },function () {
                                state = 'rejected';
                                $scope.clear(file);
                            }
                        );
                };
            } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
            }
      }]);