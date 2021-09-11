const express = require('express')
// const delay = require('delay')
// const pify = require('pify')
const auth = require('basic-auth').auth

const test = require('ava')
const version = require('./package.json').version
const TheAuthAPI = require('.')
/* var sinon = require('sinon')
var spy = sinon.spy
var stub = sinon.stub

const noop = () => {}

const context = {
  library: {
    name: 'theanalyticsapi',
    version
  }
}

const metadata = { nodeVersion: process.versions.node }
*/
const port = 4063

const createClient = options => {
  options = Object.assign({
    host: `http://localhost:${port}`
  }, options)

  const client = new TheAuthAPI('key', options)
  return client
}

test.before.cb(t => {
  express()
    .post('/auth/authenticate', (req, res) => {
      const batch = req.body

      const { name: writeKey } = auth(req)
      if (!writeKey) {
        return res.status(400).json({
          error: { message: 'missing write key' }
        })
      }

      const ua = req.headers['user-agent']
      if (ua !== `theauthapi-client-node/${version}`) {
        return res.status(400).json({
          error: { message: 'invalid user-agent' }
        })
      }

      if (batch[0] === 'error') {
        return res.status(400).json({
          error: { message: 'error' }
        })
      }

      if (batch[0] === 'timeout') {
        return setTimeout(() => res.end(), 5000)
      }

      res.json({})
    })
    .listen(port, t.end)
})

test('expose a constructor', t => {
  t.is(typeof TheAuthAPI, 'function')
})
/*
test('require a write key', t => {
  t.throws(() => new TheAuthAPI(), 'You must pass your project\'s write key.')
})
*/
test('default options', t => {
  const client = new TheAuthAPI('key')

  t.is(client.writeKey, 'key')
  t.is(client.host, 'https://api.theauthapi.com')
})

test('remove trailing slashes from `host`', t => {
  const client = new TheAuthAPI('key', { host: 'http://google.com///' })

  t.is(client.host, 'http://google.com')
})

test('overwrite defaults with options', t => {
  const client = new TheAuthAPI('key', {
    host: 'a'
  })

  t.is(client.host, 'a')
})

test('isErrorRetryable', t => {
  const client = createClient()

  t.false(client._isErrorRetryable({}))

  // ETIMEDOUT is retryable as per `is-retry-allowed` (used by axios-retry in `isNetworkError`).
  t.true(client._isErrorRetryable({ code: 'ETIMEDOUT' }))

  // ECONNABORTED is not retryable as per `is-retry-allowed` (used by axios-retry in `isNetworkError`).
  t.false(client._isErrorRetryable({ code: 'ECONNABORTED' }))

  t.true(client._isErrorRetryable({ response: { status: 500 } }))
  t.true(client._isErrorRetryable({ response: { status: 429 } }))

  t.false(client._isErrorRetryable({ response: { status: 200 } }))
})
