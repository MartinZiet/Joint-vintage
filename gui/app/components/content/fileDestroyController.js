angular.module('joint.ctrl')
.controller('FileDestroyController', ['$scope', '$http', function ($scope, $http) {
            var file = $scope.file, state;
            
            if (file.url) {
                file.$state = function () {
                    return state;
                    };
                file.$destroy = function () {
                state = 'pending';
                $scope.clear(file);
                return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                    }).then(
                        function () {
                            state = 'resolved';
                        },
                        function () {
                            state = 'rejected';
                        }
                    );
                };
            } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
            }
      }]);