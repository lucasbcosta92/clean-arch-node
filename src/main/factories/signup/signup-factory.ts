import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { Controller } from "../../../presentation/protocols";
import { DbAddAccount } from "../../../data/use-cases/add-account/db-add-account";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";

import { makeSignUpValidation } from "./signup-validation-factory";

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
