import { eq } from 'drizzle-orm'
import db from '../db/index.js'
import { usersTable } from '../db/schema.js'

export default {
  getUsers: async (req, res) => {
    const users = await db.select().from(usersTable).all()
    return res.json(users)
  },
  getUserById: async (req, res) => {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.validatedData.id))
      .get()
    return res.json(user)
  },

  createUser: async (req, res) => {
    const newUser = await db
      .insert(usersTable)
      .values(req.validatedData)
      .returning()
      .get()
    return res.status(201).json(newUser)
  },

  updateUser: async (req, res) => {
    const updatedUser = await db
      .update(usersTable)
      .set(req.validatedData)
      .where(eq(usersTable.id, req.params.id))
      .returning()
      .get()
    return res.json(updatedUser)
  },

  deleteUser: async (req, res) => {
    const deletedUser = await db
      .delete(usersTable)
      .where(eq(usersTable.id, req.params.id))
      .returning()
      .get()
    return res.json(deletedUser)
  },
}
