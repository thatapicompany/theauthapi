import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import {
  ApiKey,
  ApiKeyFilter,
  ApiKeyInput,
  UpdateApiKeyInput,
} from "../../types";
import { ApiKeysInterface } from "./ApiKeysInterface";
import ApiResponseError from "../../services/ApiRequest/ApiResponseError";

class ApiKeys implements ApiKeysInterface {
  api: ApiRequest;
  private readonly endpoint: string;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
    this.endpoint = "/api-keys/";
  }

  async isValidKey(apikey: string): Promise<boolean> {
    try {
      const key = await this.authenticateKey(apikey);
      return key.key !== undefined;
    } catch (error) {
      if (error instanceof ApiResponseError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async authenticateKey(apikey: string): Promise<ApiKey> {
    return await this.api.request<ApiKey>(
      HttpMethod.POST,
      `/api-keys/auth/${apikey}`
    );
  }

  async getKeys(filter?: ApiKeyFilter) {
    const endpoint = this.getKeysFilterEndpoint(filter);
    return await this.api.request<ApiKey[]>(HttpMethod.GET, endpoint);
  }

  async getKey(apikey: string) {
    return await this.api.request<ApiKey>(
      HttpMethod.GET,
      `/api-keys/${apikey}`
    );
  }

  async createKey(apiKey: ApiKeyInput) {
    return await this.api.request<ApiKey>(HttpMethod.POST, "/api-keys", apiKey);
  }

  async updateKey(apiKey: string, updatedKey: UpdateApiKeyInput) {
    return await this.api.request<ApiKey>(
      HttpMethod.PATCH,
      `/api-keys/${apiKey}`,
      updatedKey
    );
  }

  async deleteKey(apiKey: string) {
    return await this.api.request<boolean>(
      HttpMethod.DELETE,
      `/api-keys/${apiKey}`
    );
  }

  async reactivateKey(apiKey: string): Promise<ApiKey> {
    return await this.api.request<ApiKey>(
      HttpMethod.PATCH,
      `/api-keys/${apiKey}/reactivate`
    );
  }

  async rotateKey(apiKey: string): Promise<ApiKey> {
    return await this.api.request<ApiKey>(
      HttpMethod.POST,
      `/api-keys/${apiKey}/rotate`
    );
  }

  private getKeysFilterEndpoint(filter?: ApiKeyFilter): string {
    let filters: string[] = [];
    if (filter !== undefined) {
      filters = Object.entries(filter).map(([key, value]) => `${key}=${value}`);
    }
    return `${this.endpoint}${filter !== undefined ? "?" : ""}${filters.join(
      "&"
    )}`;
  }
}

export default ApiKeys;
