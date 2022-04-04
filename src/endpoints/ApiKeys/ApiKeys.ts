import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import omit from "lodash.omit";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import {ApiKey, ApiKeyInput, UpdateApiKeyInput} from "../../types";
import { validateString } from "../../util";
import ApiKeysInterface from "./ApiKeysInterface";

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
    // validate string properties only
    for (const [key, value] of Object.entries(
      omit(apiKey, ["customMetaData", "rateLimitConfigs"])
    )) {
      validateString(key, value);
    }
    return await this.api.request<ApiKey>(
      HttpMethod.POST,
      "/api-keys",
      apiKey
    );
  }

  async updateKey(apiKey: string, updateTo: UpdateApiKeyInput) {
    validateString("apiKey", apiKey);
    for (const [key, value] of Object.entries(
      omit(updateTo, "customMetaData")
    )) {
      validateString(key, value);
    }
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
}

export = ApiKeys;
