import request from 'supertest'

import app from '../config/app'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('Signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    // Remove all accounts
    accountsCollection.deleteMany({})
  })

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