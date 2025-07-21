import env from '../../../config/env'

import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import { Authentication } from '../../../../domain/use-cases/authentication';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { DbAuthentication } from '../../../../data/use-cases/authentication/db-authentication';
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter';

const SALT = 12

export const makeDbAuthentication = (): Authentication => new DbAuthentication(
  new AccountMongoRepository(),
  new BcryptAdapter(SALT),
  new JwtAdapter(env.jwtSecret),
  new AccountMongoRepository()
)

