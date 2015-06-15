angular.module('joint.services')
	.service('easyRTC', function($q,Restangular,$rootScope) {
    var error, self, success;
    self = this;
    self.status = true;
    self.video_boxes_list = {};
    self.deferred = $q.defer();
    self.id = "";
    easyrtc.setSocketUrl(":8080");
    
    this.startEasyRTC = function(){
        $rootScope.$broadcast("video.chat",{status:"started"});
        console.log("########## startEasyRTC ########: " + self.id);
//        if(self.id!=""){
//            easyrtc.disconnect();
//            self.id="";
//        }
        
        // connect to socket server
        if(self.id==""){
//            
            easyrtc.connect("joint", success = function(id, room) {
              self.id = id;
              console.log("Check IN: " + self.id );
              Restangular.one("call").customPOST({easyRTCID: id}, "checkin", {}, {});

              self.deferred.resolve();
              self.room = room;
              easyrtc.setAcceptChecker(function(easyrtcid, acceptor) {
                self.init(id).then(function() {
                    self.status = false;
                    $rootScope.$broadcast("video.chat",{status:"connected"});
                    easyrtc.muteVideoObject(self.vid_in_obj, false);
                    return acceptor(true);
                  });
                });
            }, error = function() {
              toastr.warning('Could not connect','EasyRTC');
              self.id="";
            });
        }
    }
    
    this.stopEasyRTC = function(){
        $rootScope.$broadcast("video.chat",{status:"stoped"});
        console.log("STOP EasyRTC");
        easyrtc.disconnect();
        self.id="";
    }
    
    this.addVideoBox = function( object_id, box){
          self.video_boxes_list[object_id] = {'video_obj':box,
                                          'active':false,
                                          'status':'offline' 
                                          // online, offline
                                         };
      };
    this.getActiveBox = function(cb){
          var active_box_not_found = true;
          angular.forEach(self.video_boxes_list, function(obj) {
              if(obj.active == true){
                  cb(obj.video_obj);
                  active_box_not_found = false;
              }
          });
          if(active_box_not_found){
              throw "box not foud for video"
              cb(undefined);
          }
      };
    this.setActiveBox = function(objectId){
          angular.forEach(self.video_boxes_list, function(obj) {
              obj.active = false; 
              obj.video_obj.css("background","white");
          });
          self.video_boxes_list[objectId].active=true;
      };
    
    this.init = function(name) {
        self.init_deffered = $q.defer();
        
        self.getActiveBox(function(video_obj){
            if(video_obj!==undefined){
            var vid_in = video_obj;
            var vid_out = video_obj;  
            
            self.vid_in_obj = vid_in[0];
            self.vid_out_obj = vid_out[0];
            

            easyrtc.setUsername(name);
            easyrtc.setStreamAcceptor(function(easyrtcid, stream) {
              easyrtc.setVideoObjectSrc(self.vid_out_obj, stream);
              easyrtc.muteVideoObject(self.vid_in_obj, false);
            });
            easyrtc.setOnStreamClosed(function(easyrtcid) {
              self.status = true;
              $rootScope.$broadcast("video.chat",{status:"disconnected"});
              easyrtc.clearMediaStream(self.vid_out_obj);
              easyrtc.clearMediaStream(self.vid_in_obj);
              easyrtc.getLocalStream().stop();
            });
            easyrtc.setOnError(function(err) {
              easyrtc.setVideoObjectSrc(self.vid_in_obj, easyrtc.getLocalStream());
              console.log(err);
            });
            easyrtc.initMediaSource(function() {
              easyrtc.setVideoObjectSrc(self.vid_in_obj, easyrtc.getLocalStream());
              easyrtc.muteVideoObject(self.vid_in_obj, true);
              self.init_deffered.resolve();
            });
            } else {
                self.init_deffered.reject();
            }
        });
        return self.init_deffered.promise;  
      };   
    
    return {
      startEasyRTC: self.startEasyRTC,
      stopEasyRTC: self.stopEasyRTC,
      addVideoBox: self.addVideoBox,
      getActiveBox: self.getActiveBox,
      setActiveBox: self.setActiveBox,
      init: self.init,
      connection_is_enable: function(){
        return self.status;
      },
      getId: function(cb) {
        self.deferred.promise.then(function() {
          return cb(self.id);
        });
      },
      acceptConnection: function(scope, cb) {
        return easyrtc.setAcceptChecker(function(easyrtcid, acceptor) {
          self.othereasyrtcid = easyrtcid;
          cb(easyrtc.idToName(easyrtcid), acceptor, scope);
        });
      },
      endConversation: function(id){
        if(id !== void 0 && easyrtc.getConnectStatus(id) === easyrtc.IS_CONNECTED) {
            
          console.log("endConversation: function(id)");
          console.log(id);
            
          easyrtc.hangup(id);
          easyrtc.clearMediaStream(self.vid_out_obj);
          easyrtc.clearMediaStream(self.vid_in_obj);
          easyrtc.getLocalStream().stop();
        } else if(id !== void 0 && easyrtc.getConnectStatus(id) === easyrtc.NOT_CONNECTED){
          easyrtc.clearMediaStream(self.vid_out_obj);
          easyrtc.clearMediaStream(self.vid_in_obj);
          easyrtc.getLocalStream().stop();
        } 
      },
      cancel: function() {
        if (self.othereasyrtcid !== void 0 && easyrtc.getConnectStatus(self.othereasyrtcid) === easyrtc.IS_CONNECTED) {
          easyrtc.hangup(self.othereasyrtcid);
          self.othereasyrtcid = void 0;
        } else {
          easyrtc.clearMediaStream(self.vid_out_obj);
          easyrtc.clearMediaStream(self.vid_in_obj);
          easyrtc.getLocalStream().stop();
        }
      },
      performCall: function(easyrtcid) {
        self.othereasyrtcid = easyrtcid;
        if (easyrtc.getConnectStatus(self.othereasyrtcid) === easyrtc.NOT_CONNECTED) {
          easyrtc.call(easyrtcid, function(easyrtcid) {
              self.status = false;
            easyrtc.muteVideoObject(self.vid_in_obj, false);
            console.log("completed call to " + easyrtc.idToName(easyrtcid));
          });
          (function(errorMessage) {
            console.log("Error:" + errorMessage);
          });
          (function(accepted, bywho) {
            console.log((accepted ? "accepted" : "rejected") + " by " + bywho);
          });
        }
      },
      sendMessage: function(ertc_id,topic,message){
          easyrtc.sendDataWS(ertc_id, topic, message,
              function(ackmessage){
                if(ackmessage.msgType == "error"){
                    if(ackmessage.msgData && ackmessage.msgData.errorCode=="MSG_REJECT_GEN_FAIL"){
                        toastr.warning('Object you are trying to call is unavailable');
                    } else {
                        toastr.warning('Error socket connection: easyrtc.sendDataWS');
                    }
                    console.log(ackmessage);
                    $rootScope.$broadcast("video.chat",{status:"disconnected"});
                } else {
                    console.log("saw the following acknowledgment " + JSON.stringify(ackmessage));
                }
              }
              );
          
      },
//        cb(easyrtcid, msgType, msgData, targeting)
      onMessage: function( topic, cb ){
          easyrtc.setPeerListener( cb, topic );
      }    
    };
  });