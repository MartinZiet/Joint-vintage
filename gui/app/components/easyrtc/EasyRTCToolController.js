angular.module('joint.ctrl').controller('EasyRTCToolController', 
    function($scope, easyRTC, $q, $attrs, $element, Restangular,$rootScope,$stateParams) {
    
    $scope.friendId = $attrs.friendId;
    
    easyRTC.getId(function(id) {
      $scope.ertc_id = id;
    });
    $scope.call = function( obj ) {
        
      if($stateParams.objectId) {
          
          var objectId = $stateParams.objectId;
		  Restangular.one("friends", obj.id ).one("objects",  objectId).customGET("call")
              .then(function(my_id){
              
              Restangular.all("friends").customGET("call", {easyRTCID: $scope.ertc_id})
                .then(function(obj_ob){
                    
                    var temp = { obj_id: obj_ob.id,
                        name: obj_ob.name,
                        alias: obj_ob.alias,
                        ertc_id: $scope.ertc_id};
                    easyRTC.sendMessage( my_id , "call" ,{
                                   status : "calling",
                                   obj : temp });
                  
                    $rootScope.$broadcast("video.box", {
                                 status : 'waiting',
                                 calling_to : my_id,
                                 call_detales: obj});
                    });
              
              
          });
      } else {
        toastr.error('Calling is not possible',
                           "");
      }
    }
  });