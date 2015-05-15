'use strict'

describe 'Service: easyRTC', ->

  # load the service's module
  beforeEach module 'eRtcProjApp'

  # instantiate service
  easyRTC = undefined
  beforeEach inject (_easyRTC_) ->
    easyRTC = _easyRTC_

  it 'should do something', ->
    expect(!!easyRTC).toBe true
