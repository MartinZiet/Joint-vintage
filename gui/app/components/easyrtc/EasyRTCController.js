angular.module('joint.ctrl').controller('EasyRTCController', 
    function($scope, easyRTC, $q, $element, $rootScope, Restangular) {
    
    easyRTC.startEasyRTC();
    $scope.open_box = false;
    $scope.animation = false;
    $scope.call_list = [];
    $scope.waiting_anim = false;
    $scope.my_ertc_id = ""; 
    $scope.status = "no_call";
    //call_established,  , calling
    
    easyRTC.getId(function(id) {
      $scope.my_ertc_id = id;
    });
    
    var video_element = $element.find('video.self_ertc_vid');
    
    easyRTC.addVideoBox(1,video_element);
    easyRTC.setActiveBox(1);
    
    $scope.close = function(){
        $scope.open_box = false;
        $scope.animation = false;
    }
    
    $scope.open = function(){
        $scope.open_box = true;
    }
    
    $scope.answer = function(item){
        $scope.waiting_anim = false;
        easyRTC.init( item.ertc_id ).then(function() {
            item.call = true;
            $scope.status = 'call_established';
            $scope.calling_to = item.ertc_id;
            easyRTC.performCall( item.ertc_id );
            var index = $scope.call_list.indexOf(item);
            $scope.call_list.splice(index, 1);
        });
    }
    
    $scope.stopcalling = function(ertc_id){
        $scope.waiting_anim = false;
        $scope.status = 'no_call';
        easyRTC.sendMessage(ertc_id,"call",{status:"stop_calling"
                                           });
    }
    
    $scope.end = function(item){
        var index = $scope.call_list.indexOf(item);
        $scope.call_list.splice(index, 1);
        easyRTC.endConversation(item.ertc_id);
        $scope.status = 'no_call';
    }
    
    $scope.endcall = function(calling_to){
        easyRTC.endConversation(calling_to);
        $scope.status = 'no_call';
    }
    
    $scope.bussy = function(item){
        var index = $scope.call_list.indexOf(item);
        $scope.call_list.splice(index, 1);
        $scope.sendBussySignal(item.ertc_id);
    }
    
    $scope.sendBussySignal = function(id){
        easyRTC.sendMessage(id,"call",{status:"bussy"});
    }
        
    $rootScope.$on("video.box",function(event,args){
        if(args.status == 'waiting'){
            $scope.open_box = true;
            $scope.waiting_anim = true;
            $scope.calling_to = args.calling_to;
            $scope.status = 'calling';
        }
    });
    
    $rootScope.$on("video.chat",function(event,args){
        if(args.status == 'connected'){
            $scope.waiting_anim = false;
            $scope.status = 'call_established';
        }
        if(args.status == 'disconnected'){
            $scope.waiting_anim = false;
            $scope.status = 'no_call';
            $scope.$apply();
        }
    });
    
    
    easyRTC.onMessage("call",function(easyrtcid, msgType, msgData, targeting){
        
        if(msgData.status=="calling"){
            Restangular.all("friends").customGET("call", {easyRTCID: easyrtcid})
            .then(function(obj){
                console.log("********************");
                console.log(obj)
            });
            
            
//            Restangular.one('objects/call',objectId).get().then(function(obj){
//              console.log("obj");
//              console.log(obj);
//            });
            toastr.success('Your friend '+ easyrtcid +' is calling:',
                           "object: "+msgData.obj.name,{
                            closeButton: true
                });
            $scope.animation = true;
            
            var index_to_delete = -1;
            for(var a in $scope.call_list){
                if($scope.call_list[a].ertc_id == msgData.obj.ertc_id){
                    index_to_delete = a;
                }
            }
            if( index_to_delete < 0 ){
                $scope.call_list.push( msgData.obj );
            }
            
        } 
        if(msgData.status=="bussy"){
            toastr.info('Your friend '+ easyrtcid +' is bussy:',
                           "try again later: ",{
                            closeButton: true
                });
            $scope.waiting_anim = false;
        }
        if(msgData.status=="stop_calling"){
            toastr.info('Your friend '+ easyrtcid +' stopped calling:',
                           " ",{
                            closeButton: true
                });
            var index_to_delete = -1;
            for(var a in $scope.call_list){
                if($scope.call_list[a].ertc_id == easyrtcid){
                    index_to_delete = a;
                }
            }
            if( index_to_delete >= 0 ){
                $scope.call_list.splice( index_to_delete, 1 );
            }
        }
        $scope.$apply();
    });
  });