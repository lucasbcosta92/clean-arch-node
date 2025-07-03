import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

import { LogControllerDecorator } from "./log"

interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: { name: 'Account name' }
      }

      return new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return { controllerStub, sut }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

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