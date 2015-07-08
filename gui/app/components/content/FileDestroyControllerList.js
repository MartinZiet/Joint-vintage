angular.module('joint.ctrl')
.controller('FileDestroyControllerList', ['$scope', '$http', '$q', function ($scope, $http, $q) {
            var file = $scope.file, state;
            
            $scope.clear = function (files) {
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
                            file.$destroy();
                            return queue.splice(i, length);
                        }
                    }
                };
            if (file.url) {
                file.$state = function () {
                    return state;
                    };
                file.$destroy = function () {
                    state = 'pending';
                    var promises = [];
                    promises.push($http({
                                url: file.deleteurl,
                                method: file.deletetype
                        }));

                    return $q.all(promises).then(
                            function () {
                                state = 'resolved';
                            },function (err) {
                                console.log("file destroy error: ");
                                console.log(err);
                                state = 'rejected';
                            }
                        );
                };
            }
    }]);