import { MissingParamError } from "../../errors"

import { RequiredFieldValidation } from "./"

describe('Required Field Validation', () => {
  it('should return an error a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('name')

    const error = sut.validate({ another: 'another' })

    expect(error).toEqual(new MissingParamError('name'))
  })

  it('should not return if validation succeds', () => {
    const sut = new RequiredFieldValidation('name')

    const error = sut.validate({ name: 'name' })

    expect(error).toBeFalsy()
  })
})