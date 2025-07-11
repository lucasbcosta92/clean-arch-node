import { SignUpController } from "./signup"
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation
} from "./signup-protocols"

import { MissingParamError, ServerError } from "../../errors"
import { ok, serverError, badRequest } from "../../helpers/http-helper"

interface SutTypes {
  addAccountStub: AddAccount
  sut: SignUpController
  validationStub: Validation
}

const makeFakeAccount = (): AccountModel => ({
  id: 'account_id',
  name: 'account_name',
  email: 'account_email@email.com',
  password: 'account_password',
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
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
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()

  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    addAccountStub,
    sut,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('should return 500 if AddAccount throws', async () => {
    const { addAccountStub, sut } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () =>
      new Promise((_, reject) => reject(new Error()))
    )

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(serverError(new ServerError('')))
  })

  it('should call AddAccount with correct values', async () => {
    const { addAccountStub, sut } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(ok(makeFakeAccount()))
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