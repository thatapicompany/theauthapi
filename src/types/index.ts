export type ApiKey = {
  key: string;
  name: string;
  customMetaData: string;
  customAccountId: string;
  env: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RateLimitConfiguration = {
  rateLimitedEntity?: string;
  ratelimitedEnitityId?: any;
  rateLimit: number;
  rateLimitTtl: number;
};

export type ApiKeyInput = {
  name: string;
  projectId: string;
  key?: string;
  customMetaData?: object;
  customAccountId?: string;
  rateLimitConfigs?: RateLimitConfiguration;
  customUserId?: string;
};

export type UpdateApiKeyInput = {
  name: string;
  customMetaData?: object;
  customAccountId?: string;
};
