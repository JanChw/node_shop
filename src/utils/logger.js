import pino from 'pino'
import pretty from 'pino-pretty'

setGlobalLogger()

function setGlobalLogger() {
    global.logger = pino(pretty())
}


