import validator from 'validator'

import { EmailValidatorAdapter } from "./email-validator-adapter"

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@email.com')

    expect(isValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@email.com')

    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()

    const email = 'valid_email@email.com'
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid(email)

    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})