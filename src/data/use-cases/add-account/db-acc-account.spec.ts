import { DbAddAccount } from "./db-add-account"

import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols"

interface SutTypes {
  addAccountRepositoryStub: AddAccountRepository
  encrypterStub: Encrypter
  sut: DbAddAccount
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const newAccount = {
        id: 'account_id',
        name: 'account_name',
        email: 'account_email@email.com',
        password: 'encrypted_value'
      }

      return new Promise(resolve => resolve(newAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('encrypted_value'))
    }
  }

  return new EncryptStub()
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(addAccountRepositoryStub, encrypterStub)

  return { addAccountRepositoryStub, encrypterStub, sut }
}

describe(('DbAddAccount Usecase'), () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith('account_password')
  })

  it('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const account = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const account = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    await sut.add(account)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'encrypted_value'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const account = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })
})