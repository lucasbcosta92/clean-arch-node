import request from 'supertest'

import app from '../config/app'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('Login routes', () => {
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

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
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
})