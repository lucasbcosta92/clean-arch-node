import {
  AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly encrypter: Encrypter
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(account.password)

    return await this.addAccountRepository.add(
      Object.assign({}, account, { password: encryptedPassword })
    )
  }
}