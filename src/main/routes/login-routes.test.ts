import { Collection } from 'mongodb';
import request from 'supertest'
import { hash } from 'bcrypt'

import app from '../config/app'

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

let accountsCollection: Collection

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    // Remove all accounts
    await accountsCollection.deleteMany({})
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

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const hashedPassword = await hash('account_password', 12)

      await accountsCollection.insertOne({
        name: 'account_name',
        email: 'account_email@email.com',
        password: hashedPassword,
      })

      await request(app)
        .post('/api/login').send({
          email: 'account_email@email.com',
          password: 'account_password',
        })
        .expect(200)
    })
  })
})