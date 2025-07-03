import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { Controller } from "../../presentation/protocols";
import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "main/decorators/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";

const SALT = 12

export const makeSignUpController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(SALT)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bcryptAdapter)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)

  return new LogControllerDecorator(signUpController)
}
