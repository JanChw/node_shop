import { badRequestError } from './error.js'

export const pick = (obj, attrs) => {
  return attrs.reduce((newObj, attr) => {
    if (attr in obj) {
      return Object.assign(newObj, { [attr]: obj[attr] })
    }
    return newObj
    
  }, {})
}


export const omit = (obj, attrs) => {
  return Object.keys(obj).reduce((newObj, key) => {
    if (!attrs.includes(key)) {
      return { ...newObj, [key]: obj[key] }
    }
    return newObj
  }, {});
};
export const isEmptyObject = (obj) => {
  return obj !== null && obj !== void(0) && Object.keys(obj).length === 0
}

export const validate = async (schema, reqObj, attrs) => {

  if (isEmptyObject(reqObj)) throw badRequestError('数据不能为空')

  const data = pick(reqObj, attrs)
  
  const result = await schema.safeParse(data)
 
  if (!result.success) {
    const message = result.error.issues[0].message
    throw badRequestError(message)
  }

  return result.data
}


export const validateRequestBody = (schema, req, attrs) => {
  return validate(schema, req['body'], attrs)
}

export const validateRequestQuery = (schema, req, attrs) => {
  return validate(schema, req['query'], attrs)
}

export const validateRequestParams = (schema, req, attrs) => {
  return validate(schema, req['params'], attrs, )
}
