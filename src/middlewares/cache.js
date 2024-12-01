import { redis } from '../db/index.js'
export const cache = (prefix) => async (req, res, next) => {
  let key = generateKey(prefix, req)
  let data = await redis.get(key)

  if (data) {
    return res.json(JSON.parse(data))
  }

  let _json = res.json.bind(res)
  res.json = (data) => {
    const expireDuration = parseInt(process.env.REDIS_EXPIRE_DURATION)
    if (res.statusCode === 200) {
      redis.set(key, JSON.stringify(data), 'EX', expireDuration)
    }
    _json(data)
  }

  next()
}

function generateKey(prefix, req) {
  if (req.params.id) return `${prefix}:${req.params.id}`

  let { page, size, sort } = req.query
  page = page ?? 1
  size = size ?? 10
  sort = sort ?? 'id,asc'
  const [by, order] = sort.split(',')

  return `${prefix}:${page}:${size}:${by}:${order}`
}
