import { DbAddAccount } from "./db-add-account"

import { Encrypter } from "../../protocols/encrypter"

interface SutTypes {
  encrypterStub: Encrypter
  sut: DbAddAccount
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
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return { encrypterStub, sut }
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
})