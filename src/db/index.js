import { drizzle } from 'drizzle-orm/better-sqlite3'
import Redis from 'ioredis'

export const sqlite =  drizzle(process.env.DATABASE_URL)

export const redis = new Redis(process.env.REDIS_URL)
