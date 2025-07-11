import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";

import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const response = await accountsCollection.insertOne(account)
    const accountResponse = await accountsCollection.findOne(response.insertedId)

    return MongoHelper.map(accountResponse)
  }
}