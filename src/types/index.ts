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

export enum AuthedEntityType {
  USER = "USER",
  ACCESS_KEY = "ACCESS_KEY",
}

export type AuthBaseEntity = {
  isActive: boolean;
  createdBy: string;
  createdByType?: AuthedEntityType;
  createdIn: string;
  lastChangedBy: string;
  lastChangedByType?: AuthedEntityType;
  updatedAt: Date;
  createdAt: Date;
};

export type Project = AuthBaseEntity & {
  id: string;
  name: string;
  accountId: string;
  env: string;
};

export enum Environment {
  LIVE = "live",
  TEST = "test",
}

export type CreateProjectInput = {
  name: string;
  accountId: string;
  env: Environment;
};

export type UpdateProjectInput = {
  name: string;
};

export type Account = AuthBaseEntity & {
  id: string;
  name: string;
};
