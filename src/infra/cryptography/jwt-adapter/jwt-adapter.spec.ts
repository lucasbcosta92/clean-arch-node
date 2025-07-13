import jwt from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'

const SECRET = 'secret'

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter(SECRET)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  })
})