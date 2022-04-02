import axios from "axios";
import assert from "assert";
import axiosRetry from "axios-retry";
import NodeCache from "node-cache";
import removeSlash from "remove-trailing-slash";
import isString from "lodash.isstring";
import ms from "ms";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const version =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  process.env.npm_package_version || require("../package.json").version;

type Options = {
  host?: string;
  timeout?: string | number;
  cacheTTL?: number;
  enable?: boolean;
  retryCount?: number;
};

type ValidateApiKeyResponse = {
  key: string;
  name: string;
  customMetaData: string;
  customAccountId: string;
  env: string;
  createdAt: string;
  updatedAt: string;
};

class TheAuthAPI {
  queue: [];
  accessKey: string;
  host: string;
  timeout: number | string | undefined;
  cacheTTL: number;
  cache: NodeCache;

  /**
   * Initialize a new `Analytics` with your Segment project's `writeKey` and an
   * optional dictionary of `options`.
   *
   * @param {String} accessKey
   * @param {Object} [options] (optional)
   *   @property {Number} flushAt (default: 20)
   *   @property {Number} flushInterval (default: 10000)
   *   @property {String} host (default: 'https://api.segment.io')
   *   @property {Boolean} enable (default: true)
   */

  constructor(accessKey: string, options?: Options) {
    assert(accessKey, "You must pass your project's write key.");
    this.queue = [];
    this.accessKey = accessKey;
    this.host = removeSlash(options?.host || "https://api.theauthapi.com");
    this.timeout = options?.timeout;
    this.cacheTTL = options?.cacheTTL ?? 60;

    Object.defineProperty(this, "enable", {
      configurable: false,
      writable: false,
      enumerable: true,
      value: typeof options?.enable === "boolean" ? options.enable : true,
    });

    axiosRetry(axios, {
      retries: options?.retryCount ?? 3,
      retryCondition: this._isErrorRetryable,
      retryDelay: axiosRetry.exponentialDelay,
    });

    this.cache = new NodeCache({
      stdTTL: this.cacheTTL,
      checkperiod: this.cacheTTL * 0.2,
      useClones: false,
    });
  }

  async authenticateAPIKeyV2(key: string) {
    this._validate(key);
    try {
      const { data } = await axios.get<ValidateApiKeyResponse>(
        `${this.host}/api-keys/${key}`,
        { headers: this._generateHeaders() }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.statusText);
      } else {
        throw error;
      }
    }
  }

  _generateHeaders() {
    return {
      "user-agent": `theauthapi-client-node/${version}`,
      "x-api-key": this.accessKey,
      "api-key": this.accessKey,
    };
  }

  /*
    @deprecated
   */
  async authenticateAPIKey(
    key: string,
    callback?: (err: any, data: any) => any
  ) {
    this._validate(key);

    const cb = callback || noop;
    const done = (err: any) => {
      cb(err, data);
    };

    const data = {
      credentials: { api_key: key },
      timestamp: new Date().getTime(),
      sentAt: new Date().getTime(),
    };

    const req: any = {
      method: "POST",
      url: `${this.host}/auth/authenticate`,
      data,
      headers: this._generateHeaders(),
    };

    if (this.timeout) {
      req.timeout =
        typeof this.timeout === "string" ? ms(this.timeout) : this.timeout;
    }

    try {
      const data = (await axios(req)).data;
      done(data);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const error = new Error(err.response.statusText);
        return done(error);
      }
      done(err);
    }
  }

  _isErrorRetryable(error: any) {
    // Retry Network Errors.
    if (axiosRetry.isNetworkError(error)) {
      return true;
    }

    if (!error.response) {
      // Cannot determine if the request can be retried
      return false;
    }

    // Retry Server Errors (5xx).
    if (error.response.status >= 500 && error.response.status <= 599) {
      return true;
    }

    // Retry if rate limited.
    if (error.response.status === 429) {
      return true;
    }

    return false;
  }

  _validate(key: string) {
    if (!key || !isString(key)) {
      throw new Error("must pass a string");
    }
  }
}

export = TheAuthAPI;
