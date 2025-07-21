import { InvalidParamError } from "../../presentation/errors"

import { CompareFieldsValidation } from "./"

const makeSut = (field: string, fieldToCompare: string): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('Compare Fields Validation', () => {
  it('should return an error a InvalidParamError if validation fails', () => {
    const sut = makeSut('password', 'passwordConfirmation')

    const error = sut.validate({ password: 'password', passwordConfirmation: 'another_password' })

    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should not return if validation succeds', () => {
    const sut = makeSut('password', 'passwordConfirmation')

    const error = sut.validate({ password: 'password', passwordConfirmation: 'password' })

    expect(error).toBeFalsy()
  })
})