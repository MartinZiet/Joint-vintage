angular.module('joint.ctrl').controller('ertc', function($scope, easyRTC, $q) {
    $scope.button_show = false;
    $scope.name_calling = '';
    $scope.user_name = '<username>';
    easyRTC.getId(function(id) {
      $scope.ertc_id = id;
    });
    $scope.defer = $q.defer;
    $scope.ansver = function(t) {};
    $scope.call = function(id) {
      console.log('call to ' + id);
      $scope.init_media().then(function() {
        console.log('calling to ' + id);
        return easyRTC.performCall(id);
      });
    };
    $scope.cancel = function(id) {
      console.log(id);
      easyRTC.cancel();
    };
    $scope["switch"] = function() {
      $scope.button_show = true;
    };
    $scope.init_media = function() {
      var deferred;
      console.log('init');
      deferred = $scope.defer();
      easyRTC.init(angular.element('#self'), angular.element('#caller'), $scope.user_name, function() {
        console.log('Media ready to go!');
        return deferred.resolve();
      });
      return deferred.promise;
    };
    
    easyRTC.acceptConnection($scope, function(CallingName, accept, scope) {
      console.log('accept Connection');
      scope.button_show = true;
      scope.name_calling = CallingName;
      scope.ansver = function(flag) {
        if (flag) {
          scope.init_media().then(function() {
            return accept(flag);
          });
        } else {
          accept(flag);
        }
        scope.button_show = false;
      };
      scope.$apply();
    });
  });