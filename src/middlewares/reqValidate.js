import { validate } from '../utils/index.js'
import { badRequestError } from '../utils/error.js'
export const validateReq =
  (schema, attrs, path = 'body') =>
  async (req, res, next) => {
    const [error, data] = await validate(schema, req, attrs)

    if (error) throw badRequestError(error)

    req.validatedData = data

    next()
  }

