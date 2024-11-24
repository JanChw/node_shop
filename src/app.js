import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes/index.js'

const API_VERSION = process.env.API_VERSION
const app = express()

app.use(json())
app.use(urlencoded())

app.use(API_VERSION, router)

app.use(helmet())
app.use(compression())

logger.info('message from app.js')

app.use((err, req, res, next) => {
  logger.error(err.message)
})

export default app

export function getApp() {
    return app
}