import axios from "axios";
import { version } from "../../libraryMeta";
import { HttpMethod } from "./HttpMethod";
import ApiCall from "./ApiCall";
import ApiRequestError from "./ApiRequestError";
import axiosRetry from "axios-retry";
import ms from "ms";

type Config = {
  host: string;
  accessKey: string;
  headers?: object;
  retryCount?: number;
  timeout?: number | string;
};

class ApiRequest implements ApiCall {
  host: string;
  headers: object;
  accessKey: string;
  timeout: number;

  constructor(config: Config) {
    const { host, accessKey, headers, retryCount, timeout } = config;
    this.host = host;
    this.accessKey = accessKey;
    this.headers = this._generateDefaultHeaders();
    this.timeout = timeout ? (typeof timeout === "string" ? ms(timeout) : timeout) : 0;

    if (headers) {
      this.headers = { ...this.headers, headers };
    }

    axiosRetry(axios, {
      retries: retryCount ?? 3,
      retryCondition: this._isErrorRetryable,
      retryDelay: axiosRetry.exponentialDelay,
    });
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    payload?: any
  ): Promise<T> {
    try {
      const response = await axios.request<T>({
        baseURL: this.host,
        method: method,
        url: endpoint,
        data: payload,
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new ApiRequestError(
            error.response.status,
            error.response.data.message ?? error.response.statusText
          );
        } else if (error.request) {
          throw new Error(error.request);
        }
      }
      throw error;
    }
  }

  _generateDefaultHeaders() {
    return {
      "user-agent": `theauthapi-client-node/${version}`,
      "x-api-key": this.accessKey,
      "api-key": this.accessKey,
    };
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
}

export default ApiRequest;
