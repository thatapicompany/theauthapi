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

  async createAccount(name: string): Promise<Account> {
    validateString("name", name);
    return await this.api.request<Account>(HttpMethod.POST, this.endpoint, {
      name,
    });
  }
}

export default Accounts;
