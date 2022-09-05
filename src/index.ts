import assert from "assert";
import removeSlash from "remove-trailing-slash";

import ApiRequest from "./services/ApiRequest/ApiRequest";
import ApiKeys from "./endpoints/ApiKeys/ApiKeys";
import { HttpMethod } from "./services/ApiRequest/HttpMethod";
import Projects from "./endpoints/Projects/Projects";
import Accounts from "./endpoints/Accounts/Accounts";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type Options = {
  host?: string;
  retryCount?: number;
};

class TheAuthAPI {
  accessKey: string;
  host: string;
  timeout: number | string | undefined;
  api: ApiRequest;
  apiKeys: ApiKeys;
  projects: Projects;
  accounts: Accounts;

  /**
   * @param {String} accessKey
   * @param {Object} [options] (optional)
   *   @property {String} host (default: 'https://api.segment.io')
   *   @property {number} retryCount (default: 3)
   */

  constructor(accessKey: string, options?: Options) {
    assert(accessKey, "You must pass your project's write key.");
    this.accessKey = accessKey;
    this.host = removeSlash(options?.host || "https://api.theauthapi.com");
    this.api = new ApiRequest({
      accessKey: this.accessKey,
      host: this.host,
      retryCount: options?.retryCount ?? 3,
    });
    this.apiKeys = new ApiKeys(this.api);
    this.projects = new Projects(this.api);
    this.accounts = new Accounts(this.api);
  }

  /*
    @deprecated
   */
  async authenticateAPIKey(
    key: string,
    callback?: (err: any, data: any) => any
  ) {
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
