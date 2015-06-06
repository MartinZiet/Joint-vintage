angular.module('joint.ctrl').controller('EasyRTCToolController', 
    function($scope, easyRTC, $q, $attrs, $element, Restangular,$rootScope) {
    
    $scope.friendId = $attrs.friendId;
    
    easyRTC.getId(function(id) {
      $scope.ertc_id = id;
    });
    $scope.call = function( fId , obj) {
        
      var what_is_youre_ertc_id = Restangular.one("friends", fId)
        .one("objects", obj.id).customGET("call");

      what_is_youre_ertc_id.then(function(my_id){
          var temp = { obj_id: obj.id,
                    name: obj.name,
                    ertc_id: $scope.ertc_id};
          easyRTC.sendMessage( $scope.temp_rtc_id , "call" ,{
                           status : "calling",
                           obj : temp });
                   
          $rootScope.$broadcast("video.box", {
                             status : 'waiting',
                             calling_to : my_id });
      });
    }
  });