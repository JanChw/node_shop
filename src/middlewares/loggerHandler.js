import { styleText as text } from 'node:util'
export const log = (req, res, next) => {
    logger.info(`Received ${text('redBright', req.method)} request for ${text('redBright', req.url)} from ${text('redBright', req.ip)}`)
    next()
}