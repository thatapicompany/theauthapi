import {
  ApiKey,
  ApiKeyFilter,
  ApiKeyInput,
  UpdateApiKeyInput,
} from '../../types';

export interface ApiKeysInterface {
  isValidKey(apiKey: string): Promise<boolean>;
  getKey(apiKey: string): Promise<ApiKey>;
  authenticateKey(apiKey: string): Promise<ApiKey>;
  getKeys(filter?: ApiKeyFilter): Promise<ApiKey[]>;
  createKey(apiKey: ApiKeyInput): Promise<ApiKey>;
  updateKey(apiKey: string, updateTo: UpdateApiKeyInput): Promise<ApiKey>;
  deleteKey(apiKey: string): Promise<boolean>;
  reactivateKey(apiKey: string): Promise<ApiKey>;
  rotateKey(apiKey: string): Promise<ApiKey>;
}
