import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

import { LogControllerDecorator } from "./log"

class ControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = {
      statusCode: 200,
      body: { name: 'Account name' }
    }

    return new Promise(resolve => resolve(httpResponse))
  }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const controllerStub = new ControllerStub()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const sut = new LogControllerDecorator(controllerStub)

    const httpRequest = {
      body: {
        name: 'account_name',
        email: 'account_email@email.com',
        password: 'account_password',
        passwordConfirmation: 'account_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})