import { badRequest, serverError } from "../../helpers/http-helper"

import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from "./signup-protocols"
import { InvalidParamError, MissingParamError } from "../../errors"

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) { }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
      }

      const { email, name, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}