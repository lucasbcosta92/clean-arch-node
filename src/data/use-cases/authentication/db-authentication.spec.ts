import { AccountModel } from "../../../domain/models/account"

import { DbAuthentication } from "./db-authentication"
import { LoadAccountByEmailRepository } from "../../protocols"

describe(('DbAuthentication Usecase'), () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'account_id',
          name: 'account_name',
          email: 'account_email@email.com',
          password: 'account_password'
        }

        return new Promise(resolve => resolve(account))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    sut.auth({
      email: 'account_email@email.com',
      password: 'account_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('account_email@email.com')
  })
})