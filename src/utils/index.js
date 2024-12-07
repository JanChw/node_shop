import { badRequestError } from './error.js'
export const pick = (obj, attrs) => {
  const newObj = {}
  for (const attr of attrs) {
    if (attr in obj) {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}


export const omit = (obj, attrs) => {
  const newObj = {} 
  for (const key in obj) {
    if (!attrs.includes(key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export const isEmptyObject = (obj) => {
  return obj !== null && obj !== void 0 && Object.keys(obj).length === 0
}

// TODO: validateParams validateQuery validateBody
export const validate = async (schema, req, attrs, path) => {
  if (isEmptyObject(req[path])) return [badRequestError('数据不能为空'), null]

  const data = permit({ ...req.body, ...req.params, ...req.query }, attrs)
  console.log(data)
  const result = await schema.safeParse(data)
  console.log(result)
  if (!result.success) {
    const message = result.error.issues[0].message
    return [badRequestError(message), null]
  }

  return [null, result.data]
}
