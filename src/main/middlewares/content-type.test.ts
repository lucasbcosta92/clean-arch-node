import { Request, Response } from 'express'
import request from 'supertest'

import app from '../config/app'

describe('Content Type Middleware', () => {
  it('should return default content type json', async () => {
    app.get('/test-content-type', (_: Request, res: Response) => {
      res.send()
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  it('should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (_: Request, res: Response) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})