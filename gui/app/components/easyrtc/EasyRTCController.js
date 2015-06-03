angular.module('joint.ctrl').controller('EasyRTCController', function($scope, easyRTC, $q, $attrs, $element, Restangular) {
    
    $scope.button_show = false;
    $scope.friendId = $attrs.friendId;
    var video_element = $element.find('video.self_ertc_vid');
    
    easyRTC.getId(function(id) {
      $scope.ertc_id = id;
    });
    
//    Restangular
    
    easyRTC.addVideoBox($attrs.objectId,video_element);
//    TODO: niedokończone
    $scope.call = function( fId , oId ) {
        
      /*easyRTC.setActiveBox($attrs.objectId);
      easyRTC.init( $scope.friendId ).then(function() {
        console.log('calling to ' + id);
        return easyRTC.performCall(id);
      });*/
    };
    
    $scope.activate_box = function(){
        easyRTC.setActiveBox($attrs.objectId);
    }
    
    $scope.cancel = function(id) {
      console.log(id);
      easyRTC.cancel();
    };
    
    $scope["switch"] = function() {
      $scope.button_show = true;
    };
    
    
//    $scope.init_media = function(video) {
//      var deferred;
//      deferred = $scope.defer();
//      easyRTC.init(video,video, $scope.user_name, function() {
//          return deferred.resolve();
//      });
//      return deferred.promise;
//    };
    
//    easyRTC.acceptConnection($scope, function(CallingName, accept, scope) {
//      console.log('accept Connection');
//      easyRTC.init( $scope.userId ).then(function() {
//            return accept(true);
//          });
//    });
    
//    easyRTC.acceptConnection($scope, function(CallingName, accept, scope) {
//      console.log('accept Connection');
//      scope.button_show = true;
//      scope.name_calling = CallingName;
//      scope.ansver = function(flag) {
//        if (flag) {
//          scope.init_media().then(function() {
//            return accept(flag);
//          });
//        } else {
//          accept(flag);
//        }
//        scope.button_show = false;
//      };
//      scope.$apply();
//    });
  });