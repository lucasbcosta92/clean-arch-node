import { ObjectId } from "mongodb";

import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";

import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/udpate-access-token-repository";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const response = await accountsCollection.insertOne(account)
    const accountResponse = await accountsCollection.findOne(response.insertedId)

    return MongoHelper.map(accountResponse)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accountResponse = await accountsCollection.findOne({ email })

    return accountResponse && MongoHelper.map(accountResponse)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')

    await accountsCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: token
      }
    })

  }
}