
import { Express, Router } from 'express'
import fg from 'fast-glob'

const ROUTES_PATH = '**/src/main/routes/**routes.ts'

export default (app: Express): void => {
  const router = Router()

  // base route
  app.use('/api', router)

  fg.sync(ROUTES_PATH).map(async (file) => {
    const route = (await import(`../../../${file}`)).default

    route(router)
  })
}
