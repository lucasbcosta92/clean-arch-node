import { SignUpController } from "./signup"
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "./signup-protocols"

import { InvalidParamError, MissingParamError, ServerError } from "../../errors"

interface SutTypes {
  addAccountStub: AddAccount
  emailValidatorStub: EmailValidator
  sut: SignUpController
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'account_id',
        name: 'account_name',
        email: 'account_email@email.com',
        password: 'account_password'
      }

      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
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
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { addAccountStub, emailValidatorStub, sut, }
}

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'another_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  it('should call EmailValidator with correct email', async () => {
    const { emailValidatorStub, sut } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('johndoe@email.com')
  })

  it('should return 500 if AddAccount throws', async () => {
    const { addAccountStub, sut } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () =>
      new Promise((_, reject) => reject(new Error()))
    )

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(''))
  })

  it('should call AddAccount with correct values', async () => {
    const { addAccountStub, sut } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'account_name',
        email: 'account_email@email.com',
        password: 'account_password',
        passwordConfirmation: 'account_password'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'account_id',
      name: 'account_name',
      email: 'account_email@email.com',
      password: 'account_password',
    })
  })
})