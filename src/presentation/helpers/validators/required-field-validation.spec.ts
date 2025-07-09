import { MissingParamError } from "@presentation/errors"
import { RequiredFieldValidation } from "./"

describe('Required Field Validation', () => {
  it('should return an error a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('name')

    const error = sut.validate({ another: 'another' })

    expect(error).toEqual(new MissingParamError('name'))
  })
})