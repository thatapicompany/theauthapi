import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import omit from "lodash.omit";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import {
  ApiKey,
  ApiKeyFilter,
  ApiKeyInput,
  UpdateApiKeyInput,
} from "../../types";
import { validateString } from "../../util";
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
    validateString("apikey", apikey);
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
    validateString("apikey", apikey);
    return await this.api.request<ApiKey>(
      HttpMethod.GET,
      `/api-keys/${apikey}`
    );
  }

  async createKey(apiKey: ApiKeyInput) {
    this.validateCreateKeyInput(apiKey);
    return await this.api.request<ApiKey>(HttpMethod.POST, "/api-keys", apiKey);
  }

  async updateKey(apiKey: string, updatedKey: UpdateApiKeyInput) {
    this.validateUpdateKeyInput(apiKey, updatedKey);
    return await this.api.request<ApiKey>(
      HttpMethod.PATCH,
      `/api-keys/${apiKey}`,
      updatedKey
    );
  }

  async deleteKey(apiKey: string) {
    validateString("apiKey", apiKey);
    return await this.api.request<boolean>(
      HttpMethod.DELETE,
      `/api-keys/${apiKey}`
    );
  }

  private validateCreateKeyInput(apiKey: ApiKeyInput) {
    if (!apiKey) {
      throw new TypeError("apiKey must be an object");
    }
    if (!apiKey.name) {
      throw TypeError("apiKey object must contain the property name");
    }
    // validate string properties only
    for (const [key, value] of Object.entries(
      omit(apiKey, ["customMetaData", "rateLimitConfigs"])
    )) {
      validateString(key, value);
    }
  }

  private validateUpdateKeyInput(
    apiKey: string,
    updatedKey: UpdateApiKeyInput
  ) {
    if (!updatedKey) {
      throw new TypeError("updatedKey must be an object");
    }
    if (!updatedKey.name) {
      throw TypeError("updatedKey object must contain the property [name]");
    }
    validateString("apiKey", apiKey);
    validateString("name", updatedKey.name);
  }

  private validateFiltersInput(filter?: ApiKeyFilter) {
    if (filter) {
      if (filter.isActive && typeof filter.isActive !== "boolean") {
        throw TypeError("isActive must be a boolean");
      }
      Object.entries(omit(filter, "isActive")).forEach(([key, value]) => {
        validateString(key, value);
      });
    }
  }

  private getKeysFilterEndpoint(filter?: ApiKeyFilter): string {
    this.validateFiltersInput(filter);
    let filters: string[] = [];
    if (filter) {
      filters = Object.entries(filter).map(([key, value]) => `${key}=${value}`);
    }
    return `${this.endpoint}${filter ? "?" : ""}${filters.join("&")}`;
  }
}

export default ApiKeys;
