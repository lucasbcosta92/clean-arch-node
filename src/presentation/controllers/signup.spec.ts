import { SignUpController } from "./signup"

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response = sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
  })
})