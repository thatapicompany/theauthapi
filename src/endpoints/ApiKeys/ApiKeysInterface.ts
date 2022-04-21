import {
  ApiKey,
  ApiKeyFilter,
  ApiKeyInput,
  UpdateApiKeyInput,
} from "../../types";

export interface ApiKeysInterface {
  isValidKey(apiKey: string): Promise<boolean>;
  getKey(apiKey: string): Promise<ApiKey>;
  getKeys(projectId: string, filter?: ApiKeyFilter): Promise<ApiKey[]>;
  createKey(apiKey: ApiKeyInput): Promise<ApiKey>;
  updateKey(apiKey: string, updateTo: UpdateApiKeyInput): Promise<ApiKey>;
  deleteKey(apiKey: string): Promise<boolean>;
}
