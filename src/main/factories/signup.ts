import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { SignUpController } from "../../presentation/controllers/signup/signup";

const SALT = 12

export const makeSignUpController = (): SignUpController => {
  const bcryptAdapter = new BcryptAdapter(SALT)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bcryptAdapter)

  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
