import { LoginController } from "./login"

import { badRequest } from "../../../presentation/helpers/http-helper"
import { MissingParamError } from "../../../presentation/errors"

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        password: 'account_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const sut = new LoginController()

    const httpRequest = {
      body: {
        email: 'account_email@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})