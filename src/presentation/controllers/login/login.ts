import { Controller, EmailValidator, HttpRequest, HttpResponse } from "./login-protocols";

import { badRequest } from "../../../presentation/helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!httpRequest.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!emailIsValid) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }
  }
}