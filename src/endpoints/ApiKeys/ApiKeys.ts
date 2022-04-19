import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import omit from "lodash.omit";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { ApiKey, ApiKeyInput, UpdateApiKeyInput } from "../../types";
import { validateString } from "../../util";
import { ApiKeysInterface } from "./ApiKeysInterface";
import ApiResponseError from "../../services/ApiRequest/ApiResponseError";

class ApiKeys implements ApiKeysInterface {
  api: ApiRequest;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
  }

  async isValidKey(apikey: string): Promise<boolean> {
    validateString("apikey", apikey);
    try {
      const key = await this.api.request<ApiKey>(
        HttpMethod.GET,
        `/api-keys/${apikey}`
      );
      return key.key !== undefined;
    } catch (error) {
      if (error instanceof ApiResponseError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async getKeys(projectId: string) {
    validateString("projectId", projectId);
    return await this.api.request<ApiKey[]>(
      HttpMethod.GET,
      `/api-keys/?projectId=${projectId}`
    );
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

  async updateKey(apiKey: string, updateTo: UpdateApiKeyInput) {
    this.validateUpdateKeyInput(apiKey, updateTo);
    return await this.api.request<ApiKey>(
      HttpMethod.PATCH,
      `/api-keys/${apiKey}`,
      updateTo
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
    if (!apiKey.name || !apiKey.projectId) {
      throw TypeError(
        "apiKey object must contain the properties [name, projectId]"
      );
    }
    // validate string properties only
    for (const [key, value] of Object.entries(
      omit(apiKey, ["customMetaData", "rateLimitConfigs"])
    )) {
      validateString(key, value);
    }
  }

  private validateUpdateKeyInput(apiKey: string, updatedKey: UpdateApiKeyInput) {
    if (!updatedKey) {
      throw new TypeError("updatedKey must be an object");
    }
    if (!updatedKey.name) {
      throw TypeError(
        "updatedKey object must contain the property [name]"
      );
    }
    validateString("apiKey", apiKey);
    validateString("name", updatedKey.name);
  }
}

export default ApiKeys;
