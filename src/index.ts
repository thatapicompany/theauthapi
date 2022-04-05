import assert from "assert";
import removeSlash from "remove-trailing-slash";

import ApiRequest from "./services/ApiRequest/ApiRequest";
import { validateString } from "./util";
import ApiKeys from "./endpoints/ApiKeys/ApiKeys";
import { HttpMethod } from "./services/ApiRequest/HttpMethod";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type Options = {
  host?: string;
  timeout?: string | number;
  cacheTTL?: number;
  enable?: boolean;
  retryCount?: number;
};

class TheAuthAPI {
  queue: [];
  accessKey: string;
  host: string;
  timeout: number | string | undefined;
  cacheTTL: number;
  api: ApiRequest;
  apiKeys: ApiKeys;

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
    this.api = new ApiRequest({
      accessKey: this.accessKey,
      host: this.host,
    });
    this.apiKeys = new ApiKeys(this.api);

    Object.defineProperty(this, "enable", {
      configurable: false,
      writable: false,
      enumerable: true,
      value: typeof options?.enable === "boolean" ? options.enable : true,
    });
  }

  /*
    @deprecated
   */
  async authenticateAPIKey(
    key: string,
    callback?: (err: any, data: any) => any
  ) {
    validateString("key", key);

    const cb = callback || noop;
    const done = (err: any) => {
      cb(err, data);
    };

    const data = {
      credentials: { api_key: key },
      timestamp: new Date().getTime(),
      sentAt: new Date().getTime(),
    };

    try {
      const key = await this.api.request(
        HttpMethod.POST,
        "/auth/authenticate",
        data
      );
      done(key);
      return key;
    } catch (err: any) {
      if (err.response) {
        const error = new Error(err.response.statusText);
        return done(error);
      }
      done(err);
    }
  }
}

export default TheAuthAPI;
