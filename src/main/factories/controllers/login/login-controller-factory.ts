import { Controller } from '../../../../presentation/protocols';
import { LoginController } from '../../../../presentation/controllers/login/login-controller';

import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorator/log-controller-decorator-factory';
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => makeLogControllerDecorator(
  new LoginController(makeDbAuthentication(), makeLoginValidation())
)

