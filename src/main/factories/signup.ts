import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { Controller } from "../../presentation/protocols";
import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { LogControllerDecorator } from "../decorators/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";

import { makeSignUpValidation } from "./signup-validation";

const SALT = 12

export const makeSignUpController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(SALT)
  const dbAddAccount = new DbAddAccount(accountMongoRepository, bcryptAdapter)
  const logMongoRepository = new LogMongoRepository()
  const signUpValidation = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, signUpValidation)

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
