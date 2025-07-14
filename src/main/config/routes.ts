
import { Express, Router } from 'express'
import { readdirSync } from 'node:fs'

export default (app: Express): void => {
  const router = Router()
  // base route
  app.use('/api', router)

  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.')) {
      const route = (await import(`../routes/${file}`)).default

      route(router)
    }
  })
}
