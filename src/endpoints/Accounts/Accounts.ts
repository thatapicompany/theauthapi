import { AccountsInterface } from "./AccountsInterface";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { Account } from "../../types";
import { HttpMethod } from "../../services/ApiRequest/HttpMethod";
import { validateString } from "../../util";

class Accounts implements AccountsInterface {
  api: ApiRequest;
  endpoint: string;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
    this.endpoint = "/accounts";
  }

  async getAccounts(): Promise<Account> {
    return await this.api.request<Account>(HttpMethod.GET, this.endpoint);
  }

  async getAccount(accountId: string): Promise<Account> {
    validateString("accountId", accountId);
    return await this.api.request<Account>(
      HttpMethod.GET,
      `${this.endpoint}/${accountId}`
    );
  }

  async createAccount(name: string): Promise<Account> {
    validateString("name", name);
    return await this.api.request<Account>(HttpMethod.POST, this.endpoint, {
      name,
    });
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    validateString("accountId", accountId);
    return await this.api.request<boolean>(
      HttpMethod.DELETE,
      `${this.endpoint}/${accountId}`
    );
  }

  async updateAccount(accountId: string, name: string): Promise<Account> {
    validateString("accountId", accountId);
    validateString("name", name);
    return await this.api.request<Account>(
      HttpMethod.PATCH,
      `${this.endpoint}/${accountId}`,
      { name }
    );
  }
}

export default Accounts;
