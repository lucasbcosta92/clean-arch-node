import {
  AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly hasher: Hasher
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.hasher.hash(account.password)

    return await this.addAccountRepository.add(
      Object.assign({}, account, { password: encryptedPassword })
    )
  }
}