import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
  email_verified: int({ mode: 'boolean' }).notNull().default(0),
  password: text().notNull(),
})

export const ProcuctsTable = sqliteTable('products_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  price: real().notNull(),
  description: text().notNull(),
})
