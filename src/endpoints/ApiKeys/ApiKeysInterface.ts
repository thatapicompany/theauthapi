import { ApiKey, ApiKeyInput, UpdateApiKeyInput } from "../../types";

export interface ApiKeysInterface {
  authenticateKey(apiKey: string): Promise<ApiKey>;
  getKeys(projectId: string): Promise<ApiKey[]>;
  createKey(apiKey: ApiKeyInput): Promise<ApiKey>;
  updateKey(apiKey: string, updateTo: UpdateApiKeyInput): Promise<ApiKey>;
  deleteKey(apiKey: string): Promise<boolean>;
}
