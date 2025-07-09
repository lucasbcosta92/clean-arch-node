import { MissingParamError } from "../../errors"

import { Validation, ValidationComposite } from "./"

class ValidationStub implements Validation {
  validate(input: any): Error {
    return new MissingParamError('field')
  }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const validationStub = new ValidationStub()

    const sut = new ValidationComposite([validationStub])

    const error = sut.validate({ field: 'field_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})