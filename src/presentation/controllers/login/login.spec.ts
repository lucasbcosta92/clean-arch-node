import { Authentication, EmailValidator, HttpRequest } from "./login-protocols"
import { LoginController } from "./login"

import { badRequest, serverError, unauthorized } from "../../../presentation/helpers/http-helper"
import { InvalidParamError, MissingParamError, ServerError } from "../../../presentation/errors"

interface SutTypes {
  authenticationStub: Authentication
  emailValidatorStub: EmailValidator
  sut: LoginController
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'account_email@email.com',
    password: 'account_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('authentication_token'))
    }
  }

  return new AuthenticationStub()
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
  const authenticationStub = makeAuthentication()
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(authenticationStub, emailValidatorStub)

  return {
    authenticationStub,
    emailValidatorStub,
    sut
  }
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

  it('should return 400 if an invalid email is provided', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { emailValidatorStub, sut } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(serverError(new ServerError(null)))
  })

  it('should return 500 if Authentication throws', async () => {
    const { authenticationStub, sut } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    )

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(serverError(new ServerError(null)))
  })

  it('should call Authentication with correct values', async () => {
    const { authenticationStub, sut } = makeSut()

    const addSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { authenticationStub, sut } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(unauthorized())
  })
})