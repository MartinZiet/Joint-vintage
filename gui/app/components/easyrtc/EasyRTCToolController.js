angular.module('joint.ctrl').controller('EasyRTCToolController', 
    function($scope, easyRTC, $q, $attrs, $element, Restangular,$rootScope,$stateParams) {
    
    $scope.friendId = $attrs.friendId;
    $stateParams
    easyRTC.getId(function(id) {
      $scope.ertc_id = id;
    });
    $scope.call = function( obj ) {
        
      if($stateParams.objectId) {
          
          var objectId = $stateParams.objectId;
		  var what_is_youre_ertc_id = Restangular.one("friends", obj.id )
            .one("objects",  objectId).customGET("call");

          what_is_youre_ertc_id.then(function(my_id){
              var temp = { obj_id: obj.id,
                        name: obj.name,
                        ertc_id: $scope.ertc_id};
              easyRTC.sendMessage( my_id , "call" ,{
                               status : "calling",
                               obj : temp });

              $rootScope.$broadcast("video.box", {
                                 status : 'waiting',
                                 calling_to : my_id });
          });
      } else {
        toastr.error('Calling is not possible',
                           "");
      }
    }
  });