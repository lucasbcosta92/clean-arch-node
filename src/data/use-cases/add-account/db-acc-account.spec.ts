import { DbAddAccount } from "./db-add-account"

import { Encrypter } from "../../protocols/encrypter"

class EncryptStub implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return new Promise(resolve => resolve('encrypted_value'))
  }
}

describe(('DbAddAccount Usecase'), () => {
  it('should call Encrypter with correct password', async () => {
    const encrypterStub = new EncryptStub()
    const sut = new DbAddAccount(encrypterStub)

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith('account_password')
  })

  // it('', async () => {})
})