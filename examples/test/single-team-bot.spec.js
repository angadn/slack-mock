'use strict'

const expect = require('chai').expect
const delay = require('delay')

describe('single team bot', function () {
  let slackMock

  before(function () {
    // wait for bot to get bootstrapped
    this.timeout(30000)

    slackMock = require('../../index').instance

    slackMock.web.addResponse({
      url: 'https://slack.com/api/rtm.start',
      status: 200,
      body: {
        ok: true,
        self: {
          name: 'mockSelf'
        },
        team: {
          name: 'mockTeam'
        }
      }
    })

    require('../single-team-bot')

    return delay(100) // wait for bot to bootstrap and connect to rtm
  })

  beforeEach(function () {
    slackMock.web.reset()
  })

  it('should respond to hello with GO CUBS', function () {
    return slackMock.rtm.send({type: 'message', channel: 'mockChannel', user: 'usr', text: 'hello'}, slackMock.rtm.clients[slackMock.rtm.clients.length - 1])
      .then(delay(50))
      .then(() => {
        expect(slackMock.rtm.calls).to.have.length(1)
        expect(slackMock.rtm.calls[0].message.text).to.equal('GO CUBS')
      })
  })
})