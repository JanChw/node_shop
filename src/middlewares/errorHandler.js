import { isHttpError, notFoundError } from '../utils/error.js'

export const notFoundHandler = (req, res, next) => {
  next(notFoundError('请求不存在'))
}

export const errorHandler = (err, req, res, next) => {
  logger.error(err)
  logger.error(err.message)
  if (isHttpError(err)) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      data: null,
    })
  }
  res.status(500).json({
    success: false,
    message: '服务器错误',
    data: null,
  })

  console.log(res.statusCode)
}
