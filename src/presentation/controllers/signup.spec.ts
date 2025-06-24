import { SignUpController } from "./signup"

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: name'))
  })

  it('should return 400 if no email is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'John Doe',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: email'))
  })
})