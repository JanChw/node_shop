import getService from './base.service.js'
import { ProcuctsTable } from '../db/schema.js'
 
export default getService(ProcuctsTable)

//TODO:id对应的user是否存在
// export default {
//   getProductById: async (id) => {
//     const product = await db
//       .select()
//       .from(ProcuctsTable)
//       .where(eq(ProcuctsTable.id, id))
//       .get()
//     return product
//   },

//   getProducts: async () => {
//     const users = await db.select().from(ProcuctsTable).all()
//     return users
//   },

//   createProduct: async (product) => {
//     const newProduct = await db.insert(ProcuctsTable).values(product).returning().get()
//     return newProduct
//   },

//   updateProduct: async (id, product) => {
//     const updatedProduct = await db
//       .update(ProcuctsTable)
//       .set(product)
//       .where(eq(ProcuctsTable.id, id))
//       .returning()
//       .get()
//     return updatedProduct
//   },

//   deleteProduct: async (id) => {
//     const deletedProduct = await db
//       .delete(ProcuctsTable)
//       .where(eq(ProcuctsTable.id, id))
//       .returning()
//       .get()
//     return deletedProduct
//   },
// }
