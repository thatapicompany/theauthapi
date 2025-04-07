import { Account } from '../../types';

export interface AccountsInterface {
  getAccount(accountId: string): Promise<Account>;
}
