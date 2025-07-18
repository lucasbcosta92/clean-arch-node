import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const SALT = 12

const makeSut = (): BcryptAdapter => new BcryptAdapter(SALT)

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const hashValue = 'any_value'

    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash(hashValue)

    expect(hashSpy).toHaveBeenCalledWith(hashValue, SALT)
  })

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow()
  })

  it('should call compare with correct values', async () => {
    const sut = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('should return true when compare succeeds', async () => {
    const sut = makeSut()

    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBe(true)
  })

  it('should return false when compare fails', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => new Promise(resolve => resolve(false)))

    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBe(false)
  })

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.compare('any_value', 'any_hash')

    await expect(promise).rejects.toThrow()
  })
})