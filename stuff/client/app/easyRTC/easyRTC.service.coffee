'use strict'

angular.module 'eRtcProjApp'
.service 'easyRTC', ( $q ) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
    self = this
    self.deferred = $q.defer()
    easyrtc.setSocketUrl "37.59.119.110:8989"
    easyrtc.connect "joint", 
        success = (id,room) ->
            self.id = id
            self.deferred.resolve()
            self.room = room
            return
        , error = () ->
            console.log 'error'
            return
    getId: (cb) ->
        self.deferred.promise.then ->
            cb(self.id)
        return
    init: (vid_in, vid_out, name, cb ) ->
        console.log 'init'
        self.vid_in_obj = vid_in[0]
        self.vid_out_obj = vid_out[0]
        
        easyrtc.setUsername(name)
        
        easyrtc.setStreamAcceptor (easyrtcid, stream) ->
            
            #self.vid_out_obj.src = window.URL.createObjectURL(stream);
            easyrtc.setVideoObjectSrc self.vid_out_obj , stream 
            return
            
        easyrtc.setOnStreamClosed (easyrtcid) ->
            easyrtc.clearMediaStream self.vid_out_obj
            easyrtc.clearMediaStream self.vid_in_obj
            easyrtc.getLocalStream().stop()
            return
    
        easyrtc.setOnError (err) ->
            easyrtc.setVideoObjectSrc self.vid_in_obj, easyrtc.getLocalStream()
            console.log err
            return
        
        easyrtc.initMediaSource -> 
            easyrtc.setVideoObjectSrc self.vid_in_obj, easyrtc.getLocalStream()
            cb() 
            return
        return 
            
            
    acceptConnection: (scope, cb) ->    
        easyrtc.setAcceptChecker (easyrtcid, acceptor) ->
            self.othereasyrtcid = easyrtcid
            cb easyrtc.idToName( easyrtcid ), acceptor, scope    
            return
        
            
    cancel: ->
        if self.othereasyrtcid != undefined and easyrtc.getConnectStatus( self.othereasyrtcid) == easyrtc.IS_CONNECTED 
            easyrtc.hangup self.othereasyrtcid
            self.othereasyrtcid = undefined
        else 
            console.log 'you are not connected'
            easyrtc.clearMediaStream self.vid_out_obj
            easyrtc.clearMediaStream self.vid_in_obj
            easyrtc.getLocalStream().stop()
        return
            
    performCall: (easyrtcid) ->
        self.othereasyrtcid = easyrtcid
        if easyrtc.getConnectStatus( self.othereasyrtcid) == easyrtc.NOT_CONNECTED
            
            easyrtc.call easyrtcid, 
            (easyrtcid) ->
                console.log "completed call to " + easyrtc.idToName easyrtcid
                return
            (errorMessage) ->  
                console.log "Error:" + errorMessage 
                return
            (accepted, bywho) ->
                console.log (if accepted then "accepted" else "rejected") + " by " + bywho
                return
        return
    