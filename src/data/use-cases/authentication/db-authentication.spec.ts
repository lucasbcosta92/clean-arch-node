import { AccountModel } from "../../../domain/models/account"
import { AuthenticationModel } from "../../../domain/use-cases/authentication"

import { DbAuthentication } from "./db-authentication"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: DbAuthentication
}

const makeFakeAccount = (): AccountModel => ({
  id: 'account_id',
  name: 'account_name',
  email: 'account_email@email.com',
  password: 'account_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'account_email@email.com',
  password: 'account_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    loadAccountByEmailRepositoryStub,
    sut
  }
}

describe(('DbAuthentication Usecase'), () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    const authenticationParams = makeFakeAuthentication()

    await sut.auth(authenticationParams)

    expect(loadSpy).toHaveBeenCalledWith(authenticationParams.email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const authenticationParams = makeFakeAuthentication()

    const promise = sut.auth(authenticationParams)

    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const authenticationParams = makeFakeAuthentication()

    const response = await sut.auth(authenticationParams)

    expect(response).toBe(null)
  })
})