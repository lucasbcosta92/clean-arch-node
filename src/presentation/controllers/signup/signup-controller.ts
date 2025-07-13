import { badRequest, ok, serverError } from "../../helpers/http-helper"

import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from "./signup-controller-protocols"

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) return badRequest(error)

      const { email, name, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}