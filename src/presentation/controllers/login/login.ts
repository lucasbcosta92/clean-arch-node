import { Controller, EmailValidator, HttpRequest, HttpResponse } from "./login-protocols";

import { badRequest } from "../../../presentation/helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    const emailIsValid = this.emailValidator.isValid(email)

    if (!emailIsValid) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }
  }
}