import { Controller, HttpRequest, HttpResponse } from "./login-protocols";

import { badRequest } from "../../../presentation/helpers/http-helper";
import { MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}