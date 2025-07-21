import { Router } from "express";

import { adaptRoute } from "../adapter/express/express-route-adapter";
import { makeLoginController } from "../factories/controllers/login/login-controller-factory";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/signup', adaptRoute(makeSignUpController()))
}