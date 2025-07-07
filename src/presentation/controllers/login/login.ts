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
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth(email, password)
    }
    catch (error) {
      return serverError(error)
    }
  }
}