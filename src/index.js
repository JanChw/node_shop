import { createServer } from 'node:http'
import './utils/logger.js'
import app from './app.js'

const PORT = process.env.PORT || 3000

createServer(app).listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}!!!`)
})
