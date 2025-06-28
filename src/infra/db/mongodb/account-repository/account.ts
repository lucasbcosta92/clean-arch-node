import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";

import { AddAccountRepository } from "../../../../data/protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = MongoHelper.getCollection('accounts')

    console.log('accountsCollection', accountsCollection)

    const response = await accountsCollection.insertOne(account)

    console.log('response', response)

    const accountResponse = await accountsCollection.findOne(response.insertedId)

    console.log('accountResponse', accountResponse)

    return MongoHelper.map(accountResponse)
  }
}