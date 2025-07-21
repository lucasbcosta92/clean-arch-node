import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import { AddAccount } from '../../../../domain/use-cases/add-account';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { DbAddAccount } from '../../../../data/use-cases/add-account/db-add-account';

const SALT = 12

export const makeDbAddAccount = (): AddAccount => new DbAddAccount(
  new AccountMongoRepository(), new BcryptAdapter(SALT), new AccountMongoRepository()
)
