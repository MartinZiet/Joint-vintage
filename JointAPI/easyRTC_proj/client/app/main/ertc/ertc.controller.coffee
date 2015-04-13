'use strict'

angular.module 'eRtcProjApp'
.controller 'ertc', ($scope, $http, easyRTC, $q) ->
  
#  easyRTC.init angular.element( '#self'), angular.element( '#caller'), 'ZenekWymiataczka'
  $scope.button_show = false
  $scope.hello = 'hello world'
  $scope.name_calling = ''
  $scope.defer = $q.defer
  $scope.ansver = (t) ->
    return
    
  $scope.call = (id) ->
    console.log 'call ' + id
    $scope.init_media().then ->
        console.log 'calling to ' +id
        easyRTC.performCall id
    return

  $scope.cancel = (id) ->
    console.log id
    easyRTC.cancel id
    return
  $scope.switch = ->
    $scope.button_show = true
    return

  $scope.init_media = () ->
    console.log 'init'
    deferred = $scope.defer()
    
    easyRTC.init angular.element( '#self'), angular.element( '#caller'), 'ZenekWymiataczka', ->
        console.log 'callback and resolve'
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
        scope.button_show = false
        return
    scope.$apply()
    return

  $scope.refresh = ->
    console.log 'refresh'
    easyRTC.getApplicationFields
   
  