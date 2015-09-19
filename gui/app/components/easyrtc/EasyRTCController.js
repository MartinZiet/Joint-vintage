angular.module('joint.ctrl').controller('EasyRTCController',
    ['$scope', 'easyRTC', '$q', '$element', '$rootScope', 'Restangular', 'JointGlobalService', 
    function($scope, easyRTC, $q, $element, $rootScope, Restangular, $global) {
    
    //var loggedIn = $global.checkLogin();	
	$scope.showvideobox = true;
    
    
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
    var video_element_in = $element.find('video.self_ertc_vid_in');
    
    easyRTC.addVideoBox(1,video_element,video_element_in);
    easyRTC.setActiveBox(1);
    
    $scope.close = function(){
        $scope.open_box = false;
        $scope.animation = false;
    }
    
    $scope.open = function(){
        $scope.open_box = true;
    }
    
    $scope.answer = function(item){
        console.log("answare");
        $scope.waiting_anim = false;
        easyRTC.init( item.ertc_id ).then(function() {
            item.call = true;
            $scope.caller_name = item.alias;
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
        $scope.caller_name = "";
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
        $scope.caller_name = "";
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
            $scope.caller_name = args.call_detales.alias;
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
            $scope.caller_name = "";
//            $scope.$apply();
        }
        if(args.status == 'started'){
            $scope.showvideobox = true;
        }
        if(args.status == 'stoped'){
            $scope.showvideobox = false;
        }
    });
    
    
    easyRTC.onMessage("call",function(easyrtcid, msgType, msgData, targeting){
        
        if(msgData.status=="calling"){
            
            toastr.success("object "+msgData.obj.name,
                           msgData.obj.alias +' is calling' ,{
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
            toastr.info('Your friend is bussy:',
                           "try again later: ",{
                            closeButton: true
                });
            $scope.waiting_anim = false;
        }
        if(msgData.status=="stop_calling"){
            var index_to_delete = -1;
            for(var a in $scope.call_list){
                if($scope.call_list[a].ertc_id == easyrtcid){
                    index_to_delete = a;
                    toastr.info('Object '+ $scope.call_list[a].name +' stopped calling:',
                           " ",{
                            closeButton: true
                });
                }
            }
            if( index_to_delete >= 0 ){
                $scope.call_list.splice( index_to_delete, 1 );
            }
            $scope.caller_name = "";
        }
        $scope.$apply();
    });
  }]);