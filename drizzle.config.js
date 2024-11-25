import { defineConfig } from 'drizzle-kit'
import { resolve } from 'node:path'

process.loadEnvFile(resolve(__dirname, '.env.local'))

console.log(process.env.DATABASE_URL)
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.js',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
