import { Controller } from '../../../../presentation/protocols';
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';

import { makeDbAddAccount } from '../../use-cases/account/db-add-account-factory';
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorator/log-controller-decorator-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => makeLogControllerDecorator(
  new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
)

