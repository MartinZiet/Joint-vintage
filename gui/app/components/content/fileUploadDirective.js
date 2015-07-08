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
                if(!$scope.cnt.tags.files) { $scope.cnt.tags.files = []; }
                $scope.uploaded_files = $scope.cnt.tags.files;
            }
        }
    }]);
            