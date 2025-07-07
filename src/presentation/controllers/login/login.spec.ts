import { LoginController } from "./login"

import { badRequest } from "../../../presentation/helpers/http-helper"
import { InvalidParamError, MissingParamError } from "../../../presentation/errors"
import { EmailValidator } from "./login-protocols"

interface SutTypes {
  emailValidatorStub: EmailValidator
  sut: LoginController
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return { emailValidatorStub, sut }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'account_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'account_email@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })


  it('should call EmailValidator with correct email', async () => {
    const { emailValidatorStub, sut } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        email: 'account_email@email.com',
        password: 'account_password'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('account_email@email.com')
  })

})