export type ApiKey = {
  key: string;
  name: string;
  customMetaData: object;
  customAccountId: string;
  customUserId: string;
  env: Environment;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type RateLimitConfiguration = {
  rateLimitedEntity?: string;
  ratelimitedEnitityId?: string;
  rateLimit: number;
  rateLimitTtl: number;
};

export type ApiKeyInput = {
  name: string;
  projectId?: string;
  key?: string;
  customMetaData?: object;
  customAccountId?: string;
  customUserId?: string;
  rateLimitConfigs?: RateLimitConfiguration;
};

export type ApiKeyFilter = {
  projectId?: string;
  customAccountId?: string;
  customUserId?: string;
  isActive?: boolean;
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
  env: Environment;
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
