import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'
import { sign } from 'crypto'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

const SECRET = 'secret'

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter(SECRET)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  })

  it('should return a token on sign success', async () => {
    const sut = new JwtAdapter(SECRET)

    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toBe('any_token')
  })
})