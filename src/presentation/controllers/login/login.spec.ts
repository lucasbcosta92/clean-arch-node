import { Authentication, HttpRequest, Validation } from "./login-protocols"
import { LoginController } from "./login"

import { badRequest, ok, serverError, unauthorized } from "../../../presentation/helpers/http-helper"
import { MissingParamError, ServerError } from "../../../presentation/errors"

interface SutTypes {
  authenticationStub: Authentication
  sut: LoginController
  validationStub: Validation
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)

  return {
    authenticationStub,
    sut,
    validationStub
  }
}

describe('Login Controller', () => {
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

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(ok({ accessToken: 'authentication_token' }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any'))

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(badRequest(new MissingParamError('any')))
  })
})