import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';

import { AccountMongoRepository } from './account-mongo-repository';

let accountsCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  it('should return an account on add success', async () => {
    const sut = makeSut()

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

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    const accountData = {
      name: 'account2_name',
      email: 'account2_email@email.com',
      password: 'account2_password'
    }

    await accountsCollection.insertOne(accountData)

    const account = await sut.loadByEmail(accountData.email)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('account3_email@email.com')

    expect(account).toBeFalsy()
  })

  it('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()

    const accountData = {
      name: 'account3_name',
      email: 'account3_email@email.com',
      password: 'account3_password'
    }

    const response = await accountsCollection.insertOne(accountData)

    await sut.updateAccessToken(String(response.insertedId), 'any_token')

    const account = await accountsCollection.findOne(response.insertedId)

    expect(account).toBeTruthy()
    expect(account.accessToken).toBeTruthy()
  })
})