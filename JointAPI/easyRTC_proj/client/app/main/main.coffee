'use strict'

angular.module 'eRtcProjApp'
.config ($routeProvider) ->
  $routeProvider
  .when '/',
    templateUrl: 'app/main/main.html'
    controller: 'MainCtrl'
  .when '/ertc',
    templateUrl: 'app/main/ertc/index.html'
    controller: 'ertc'
