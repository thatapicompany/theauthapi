import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import omit from "lodash.omit";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { ApiKey, ApiKeyInput, UpdateApiKeyInput } from "../../types";
import { validateString } from "../../util";
import { ApiKeysInterface } from "./ApiKeysInterface";

class ApiKeys implements ApiKeysInterface {
  api: ApiRequest;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
  }

  async authenticateKey(apikey: string) {
    validateString("apikey", apikey);
    return await this.api.request<ApiKey>(
      HttpMethod.GET,
      `/api-keys/${apikey}`
    );
  }

  async getKeys(projectId: string) {
    validateString("projectId", projectId);
    return await this.api.request<ApiKey[]>(
      HttpMethod.GET,
      `/api-keys/?projectId=${projectId}`
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
      throw new TypeError("apiKey must be an object");
    }
    if (!updatedKey.name) {
      throw TypeError(
        "apiKey object must contain the property [name]"
      );
    }
    validateString("name", apiKey);
    validateString("updated", updatedKey.name);
  }
}

export default ApiKeys;
