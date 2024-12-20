//TODO: 使用路径别名
//TODO: 响应格式化
//TODO: 路由
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import router from './routes/index.js'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js'
import { log as logger } from './middlewares/loggerHandler.js'

const API_VERSION = process.env.API_VERSION
const app = express()

app.use(json())
app.use(urlencoded())

app.use(helmet())
app.use(compression())

app.use(logger)

app.use(API_VERSION, router)

app.use(notFoundHandler)

app.use(errorHandler)



export default app
