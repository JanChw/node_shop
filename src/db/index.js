import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'
import Redis from 'ioredis'

export const sqlite =  drizzle(process.env.DATABASE_URL, {schema})

export const redis = new Redis(process.env.REDIS_URL)
