import { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse } from "./login-protocols";

import { badRequest, serverError } from "../../../presentation/helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly emailValidator: EmailValidator
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      await this.authentication.auth(email, password)
    }
    catch (error) {
      return serverError(error)
    }
  }
}