import { DbAddAccount } from "./db-add-account"

import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from "./db-add-account-protocols"

interface SutTypes {
  addAccountRepositoryStub: AddAccountRepository
  hasherStub: Hasher
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAddAccount
}

const makeFakeAccount = (): AccountModel => ({
  id: 'account_id',
  name: 'account_name',
  email: 'account_email@email.com',
  password: 'encrypted_value'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'account_name',
  email: 'account_email@email.com',
  password: 'account_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }

  return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository()
  const hasherStub = makeHasher()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(addAccountRepositoryStub, hasherStub, loadAccountByEmailRepositoryStub)

  return {
    addAccountRepositoryStub,
    hasherStub,
    loadAccountByEmailRepositoryStub,
    sut
  }
}

describe(('DbAddAccount Usecase'), () => {
  it('should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAccountData())

    expect(hashSpy).toHaveBeenCalledWith('account_password')
  })

  it('should throw if Hasher throws', async () => {
    const { hasherStub, sut } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'hashed_value'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const response = await sut.add(makeFakeAccountData())

    expect(response).toEqual(makeFakeAccount())
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    const authenticationParams = makeFakeAccountData()

    await sut.add(authenticationParams)

    expect(loadSpy).toHaveBeenCalledWith(authenticationParams.email)
  })
})