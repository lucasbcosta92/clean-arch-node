import { Request, Response } from 'express'
import request from 'supertest'

import app from '../config/app'

describe('Body Parser Middleware', () => {
  it('should parse body as json', async () => {
    app.post('/test-body-parser', (req: Request, res: Response) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Test name', })
      .expect({ name: 'Test name', })
  })
})