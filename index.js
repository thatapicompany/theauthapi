'use strict'

const assert = require('assert')
const removeSlash = require('remove-trailing-slash')
const axios = require('axios')
const axiosRetry = require('axios-retry')
const ms = require('ms')
const version = require('./package.json').version
const isString = require('lodash.isstring')
const NodeCache = require('node-cache')

const noop = () => {}

// const axios = require('axios').default;

class TheAuthAPI {
  /**
   * Initialize a new `Analytics` with your Segment project's `writeKey` and an
   * optional dictionary of `options`.
   *
   * @param {String} writeKey
   * @param {Object} [options] (optional)
   *   @property {Number} flushAt (default: 20)
   *   @property {Number} flushInterval (default: 10000)
   *   @property {String} host (default: 'https://api.segment.io')
   *   @property {Boolean} enable (default: true)
   */

  constructor (writeKey, options) {
    options = options || {}

    assert(writeKey, 'You must pass your project\'s write key.')
    this.queue = []
    this.writeKey = writeKey
    this.host = removeSlash(options.host || 'https://api.theauthapi.com')
    this.timeout = options.timeout || false
    this.cacheTTL = options.cacheTTL || 60

    Object.defineProperty(this, 'enable', {
      configurable: false,
      writable: false,
      enumerable: true,
      value: typeof options.enable === 'boolean' ? options.enable : true
    })

    axiosRetry(axios, {
      retries: options.retryCount || 3,
      retryCondition: this._isErrorRetryable,
      retryDelay: axiosRetry.exponentialDelay
    })

    this.cache = new NodeCache({
      stdTTL: this.cacheTTL,
      checkperiod: this.cacheTTL * 0.2,
      useClones: false
    })
  }

  _validate (key, type) {
    try {
      if (!key || !isString(key)) throw new Error('must pass a string')
    } catch (e) {
      throw e
    }
  }

  /**
   * Send a track `message`.
   *
   * @param {Object} message
   * @param {Function} [callback] (optional)
   * @return {TheAnalyticsAPI}
   */

  async authenticateAPIKey (key, callback) {
    this._validate(key, 'api_key')

    callback = callback || noop

    const data = {
      credentials: { api_key: key },
      timestamp: new Date().getTime(),
      sentAt: new Date().getTime()
    }

    const done = err => {
      // callbacks.forEach(callback => callback(err))
      callback(err, data)
    }

    const headers = {}

    headers['user-agent'] = `theauthapi-client-node/${version}`
    headers['x-api-key'] = headers['api_key'] = this.writeKey

    const req = {
      method: 'POST',
      url: `${this.host}/auth/authenticate`,
      /* auth: {
        username: this.writeKey
      }, */
      data,
      headers
    }

    if (this.timeout) {
      req.timeout = typeof this.timeout === 'string' ? ms(this.timeout) : this.timeout
    }

    try {
      const data = await axios(req).data
      done(data)
      return data
    } catch (err) {
      if (err.response) {
        const error = new Error(err.response.statusText)
        return done(error)
      }

      done(err)
    }
  }

  _isErrorRetryable (error) {
    // Retry Network Errors.
    if (axiosRetry.isNetworkError(error)) {
      return true
    }

    if (!error.response) {
      // Cannot determine if the request can be retried
      return false
    }

    // Retry Server Errors (5xx).
    if (error.response.status >= 500 && error.response.status <= 599) {
      return true
    }

    // Retry if rate limited.
    if (error.response.status === 429) {
      return true
    }

    return false
  }

  getCache (key) {
    const value = this.cache.get(key)
    if (value) {
      return Promise.resolve(value)
    } else {

    }
  }

  setCache (key, value, ttl = null) {
    if (ttl) this.cache.set(key, value, ttl)
    else this.cache.set(key, value)
  }

  delCache (keys) {
    this.cache.del(keys)
  }
  delCacheStartWith (startStr = '') {
    if (!startStr) {
      return
    }

    const keys = this.cache.keys()
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key)
      }
    }
  }
  flushCache () {
    this.cache.flushAll()
  }
}

module.exports = TheAuthAPI
