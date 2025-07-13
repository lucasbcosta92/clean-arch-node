import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";

import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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
}