import { Collection } from 'mongodb';

import { LogMongoRepository } from './log'
import { MongoHelper } from '../helpers/mongo-helper';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  afterAll(async () => {
    await MongoHelper.disconnect()
  });

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors')
    errorsCollection.deleteMany({})
  })

  it('should create an error log on success', async () => {
    const sut = makeSut()

    await sut.logError('any_error')

    const countErrors = await errorsCollection.countDocuments()

    expect(countErrors).toBe(1)
  })
})