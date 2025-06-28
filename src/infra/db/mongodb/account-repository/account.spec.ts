import { MongoHelper } from '../helpers/mongo-helper';

import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  it('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const accountData = {
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password'
    }

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })

  // it('', async () => {})
})