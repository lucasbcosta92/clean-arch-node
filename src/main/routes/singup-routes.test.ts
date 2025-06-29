import request from 'supertest'

import app from '../config/app'

describe('Signup routes', () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup').send({
        name: 'account_name',
        email: 'account_email@email.com',
        password: 'account_password',
        passwordConfirmation: 'account_password'
      })
      .expect(200)
  })
})