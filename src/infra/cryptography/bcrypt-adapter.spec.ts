import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

const SALT = 12

const makeSut = (): BcryptAdapter => new BcryptAdapter(SALT)

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const hashValue = 'any_value'

    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(hashValue)

    expect(hashSpy).toHaveBeenCalledWith(hashValue, SALT)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hash')
  })
})