import { drizzle } from 'drizzle-orm/better-sqlite3'

export default drizzle(process.env.DATABASE_URL)
