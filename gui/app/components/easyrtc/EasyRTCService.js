angular.module('joint.services')

	.service('easyRTC', function($q) {
    var error, self, success;
    self = this;
    self.deferred = $q.defer();
    easyrtc.setSocketUrl(":8080");
    // connect to socket server
    easyrtc.connect("joint", success = function(id, room) {
      self.id = id;
      self.deferred.resolve();
      self.room = room;
    }, error = function() {
      console.log('error');
    });
    return {
      getId: function(cb) {
        self.deferred.promise.then(function() {
          return cb(self.id);
        });
      },
      init: function(vid_in, vid_out, name, cb) {
        console.log('init');
        self.vid_in_obj = vid_in[0];
        self.vid_out_obj = vid_out[0];
        easyrtc.setUsername(name);
        easyrtc.setStreamAcceptor(function(easyrtcid, stream) {
          easyrtc.setVideoObjectSrc(self.vid_out_obj, stream);
        });
        easyrtc.setOnStreamClosed(function(easyrtcid) {
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
          cb();
        });
      },
      acceptConnection: function(scope, cb) {
        return easyrtc.setAcceptChecker(function(easyrtcid, acceptor) {
          self.othereasyrtcid = easyrtcid;
          console.log('********* ' + easyrtc.idToName(easyrtcid));
          cb(easyrtc.idToName(easyrtcid), acceptor, scope);
        });
      },
      cancel: function() {
        if (self.othereasyrtcid !== void 0 && easyrtc.getConnectStatus(self.othereasyrtcid) === easyrtc.IS_CONNECTED) {
          easyrtc.hangup(self.othereasyrtcid);
          self.othereasyrtcid = void 0;
        } else {
          console.log('you are not connected');
          easyrtc.clearMediaStream(self.vid_out_obj);
          easyrtc.clearMediaStream(self.vid_in_obj);
          easyrtc.getLocalStream().stop();
        }
      },
      performCall: function(easyrtcid) {
        self.othereasyrtcid = easyrtcid;
        if (easyrtc.getConnectStatus(self.othereasyrtcid) === easyrtc.NOT_CONNECTED) {
          easyrtc.call(easyrtcid, function(easyrtcid) {
            console.log("completed call to " + easyrtc.idToName(easyrtcid));
          });
          (function(errorMessage) {
            console.log("Error:" + errorMessage);
          });
          (function(accepted, bywho) {
            console.log((accepted ? "accepted" : "rejected") + " by " + bywho);
          });
        }
      }
    };
  });