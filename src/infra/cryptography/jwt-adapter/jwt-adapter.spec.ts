import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'
import { sign } from 'crypto'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

const SECRET = 'secret'

const makeSut = (): JwtAdapter => new JwtAdapter(SECRET)

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  })

  it('should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toBe('any_token')
  })

  it('should throw if sign throws', async () => {
    const sut = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any_id')

    await expect(promise).rejects.toThrow()
  })
})