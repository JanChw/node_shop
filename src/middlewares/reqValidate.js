import { validate } from '../utils/index.js'
export const validateReq =
  (schema, attrs, pos = 'body') =>
  async (req, res, next) => {
    const data = await validate(schema, req[pos], attrs)

    //TODO:移除
    req.validatedData = data

    next()
  }

