import { sql } from 'drizzle-orm'
import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const UserTable = sqliteTable('user_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
  email_verified: int({ mode: 'boolean' }).notNull().default(0),
  password: text().notNull(),
})

export const AddressTable = sqliteTable('address_table', {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int().notNull().references(() => UserTable.id),
  address: text().notNull(),
  province: text().notNull().default(''),
  city: text().notNull().default(''),
  state: text().notNull().default(''),
  zipcode: text().notNull().default(''),
})

export const ProductTable = sqliteTable('product_table', {
  id: int().primaryKey({ autoIncrement: true }),
  category_id: int().notNull().references(() => CategoryTable.id),
  name: text().notNull().unique(),
  price: real().notNull(),
  description: text().notNull(),
})

export const CategoryTable = sqliteTable('category_table', {
  id: int().primaryKey({ autoIncrement: true }),
  parent_id: int().references(() => CategoryTable.id),
  order: int().notNull(),
  status: int({ mode: 'boolean' }).notNull().default(1),
  name: text().notNull().unique(),
  description: text().notNull(),

})

export const TagTable = sqliteTable('tag_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text().notNull().default(''),
})

export const ProductTagTable = sqliteTable('product_tag_table', {
  id: int().primaryKey({ autoIncrement: true }),
  product_id: int().notNull().references(() => ProductTable.id),
  tag_id: int().notNull().references(()=> TagTable.id),
}, (table) => ({
  unique: [table.product_id, table.tag_id], // 确保每个产品和标签的组合是唯一的
}))

export const ProductImageTable = sqliteTable('product_image_table', {
  id: int().primaryKey({ autoIncrement: true }),
  product_id: int().notNull().references(() => ProductTable.id),
  href: text().notNull(),
})

export const CartItemTable = sqliteTable('cart_item_table', {
  id: int().primaryKey({ autoIncrement: true }),
  cart_id: int().notNull().references(() => CartTable.id),
  product_id: int().notNull().references(() => ProductTable.id),
  quantity: int().notNull(),
  
})

export const CartTable = sqliteTable('cart_table', {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int().notNull().references(() => UserTable.id),
  create_at:text().default(sql`(CURRENT_TIMESTAMP)`)

})

export const OrderTable = sqliteTable('order_table', {  
  id: int().primaryKey({ autoIncrement: true }),
  order_number: text().notNull().unique(),
  user_id: int().notNull().references(() => UserTable.id),
  cart_id: int().notNull().references(() => CartTable.id),
  address: text().notNull(),
  total_amount: real().notNull(),
  create_at:text().default(sql`(CURRENT_TIMESTAMP)`),
  status: text().notNull().default('unpaid'),
})






