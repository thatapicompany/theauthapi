import {Account} from "../../types";

export interface AccountsInterface {
  getAccounts(): Promise<Account>;
}