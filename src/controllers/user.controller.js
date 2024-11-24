import { eq } from 'drizzle-orm';
import db from '../db/index.js'
import { usersTable } from '../db/schema.js'
export class UserController {
   
    static async getUsers(req, res) {
        const users = await db.select().from(usersTable).all();
        return res.json(users)
    }
    static async getUserById(req, res) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).get();
        return res.json(user)
    }

    static async createUser(req, res) {
        const newUser = await db.insert(usersTable).values(req.body).returning().get();
        return res.status(201).json(newUser)
    }

    static async updateUser(req, res) {
        const updatedUser = await db.update(usersTable).set(req.body).where(eq(usersTable.id, req.params.id)).returning().get();
        return res.json(updatedUser)
    }

    static async deleteUser(req, res) {
        const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, req.params.id)).returning().get();
        return res.json(deletedUser)
    }
}