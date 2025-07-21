import {
  AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly hasher: Hasher,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(account.email)

    const encryptedPassword = await this.hasher.hash(account.password)

    return await this.addAccountRepository.add(
      Object.assign({}, account, { password: encryptedPassword })
    )
  }
}