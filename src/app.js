import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes/index.js'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js'



const API_VERSION = process.env.API_VERSION
const app = express()

app.use(json())
app.use(urlencoded())

app.use(helmet())
app.use(compression())

app.use(API_VERSION, router)

app.use(notFoundHandler)

app.use(errorHandler)

export default app
