import { BaseService } from './base.service.js'
import { ProductTable } from '../db/schema.js'
import { sqlite as db } from '../db/index.js'
 
export default new BaseService(db, ProductTable)

//TODO:id对应的user是否存在
// export default {
//   getProductById: async (id) => {
//     const product = await db
//       .select()
//       .from(ProductTable)
//       .where(eq(ProductTable.id, id))
//       .get()
//     return product
//   },

//   getProducts: async () => {
//     const users = await db.select().from(ProductTable).all()
//     return users
//   },

//   createProduct: async (product) => {
//     const newProduct = await db.insert(ProductTable).values(product).returning().get()
//     return newProduct
//   },

//   updateProduct: async (id, product) => {
//     const updatedProduct = await db
//       .update(ProductTable)
//       .set(product)
//       .where(eq(ProductTable.id, id))
//       .returning()
//       .get()
//     return updatedProduct
//   },

//   deleteProduct: async (id) => {
//     const deletedProduct = await db
//       .delete(ProductTable)
//       .where(eq(ProductTable.id, id))
//       .returning()
//       .get()
//     return deletedProduct
//   },
// }
