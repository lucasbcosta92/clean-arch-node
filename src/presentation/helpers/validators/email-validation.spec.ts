import { EmailValidator } from "../../protocols/email-validator"
import { InvalidParamError } from "../../errors"

import { EmailValidation } from "./"

interface SutTypes {
  emailValidatorStub: EmailValidator
  sut: EmailValidation
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
  const sut = new EmailValidation('email', emailValidatorStub)

  return { emailValidatorStub, sut }
}

describe('Email Validation', () => {
  it('should return an error if EmailValidator returns false', () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'johndoe@email.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should throw if EmailValidation throws', () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  it('should call EmailValidation with correct email', () => {
    const { emailValidatorStub, sut } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'johndoe@email.com' })

    expect(isValidSpy).toHaveBeenCalledWith('johndoe@email.com')
  })
})