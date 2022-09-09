import { AccountsInterface } from "./AccountsInterface";
import ApiRequest from "../../services/ApiRequest/ApiRequest";
import { Account } from "../../types";
import { HttpMethod } from "../../services/ApiRequest/HttpMethod";

class Accounts implements AccountsInterface {
  api: ApiRequest;
  endpoint: string;

  constructor(apiService: ApiRequest) {
    this.api = apiService;
    this.endpoint = "/accounts";
  }

  async getAccount(accountId: string): Promise<Account> {
    return await this.api.request<Account>(
      HttpMethod.GET,
      `${this.endpoint}/${accountId}`
    );
  }
}

export default Accounts;
