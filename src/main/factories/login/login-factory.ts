import env from '../../config/env'

import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { Controller } from "../../../presentation/protocols";
import { DbAuthentication } from "../../../data/use-cases/authentication/db-authentication";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter/jwt-adapter";

import { makeLoginValidation } from "./login-validation-factory";

const SALT = 12

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}
