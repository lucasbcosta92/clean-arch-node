import { MissingParamError } from "../../errors"

import { Validation, ValidationComposite } from "./"

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'field_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'field_value' })

    expect(error).toEqual(new Error())
  })

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'field_value' })

    expect(error).toBeFalsy()
  })
})