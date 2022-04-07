import { Account } from "../../types";

export interface AccountsInterface {
  getAccounts(): Promise<Account>;
  getAccount(accountId: string): Promise<Account>;
  createAccount(name: string): Promise<Account>;
}
