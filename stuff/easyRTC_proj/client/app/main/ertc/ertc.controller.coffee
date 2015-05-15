'use strict'

angular.module 'eRtcProjApp'
.controller 'ertc', ($scope, easyRTC, $q) ->
  
#  easyRTC.init angular.element( '#self'), angular.element( '#caller'), 'ZenekWymiataczka'
  $scope.button_show = false
  $scope.name_calling = ''
  $scope.user_name = 'ZenekWymiataczka'
  
  easyRTC.getId (id) ->
    $scope.ertc_id = id
    return
  $scope.defer = $q.defer
  $scope.ansver = (t) ->
    return
    
  $scope.call = (id) ->
    console.log 'call to ' + id
    $scope.init_media().then ->
        console.log 'calling to ' +id
        easyRTC.performCall id
    return

  $scope.cancel = (id) ->
    console.log id
    easyRTC.cancel()
    return
  $scope.switch = ->
    $scope.button_show = true
    return

  $scope.init_media = () ->
    console.log 'init'
    deferred = $scope.defer()
    
    easyRTC.init angular.element( '#self'), angular.element( '#caller'), $scope.user_name, ->
        console.log 'Media ready to go!'
        deferred.resolve()
    deferred.promise
    
  easyRTC.acceptConnection $scope, (CallingName,accept,scope) ->
    console.log 'accept Connection'
    scope.button_show = true
    scope.name_calling = CallingName
    scope.ansver = (flag) ->
        if flag
            scope.init_media().then -> 
                accept flag
        else 
            accept flag
        scope.button_show = false
        return
    scope.$apply()
    return
  return
   
  