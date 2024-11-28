import { eq } from 'drizzle-orm'
import { sqlite as db } from '../db/index.js'

const createServiceFn = (db) =>(schema) => {
  return new BaseService(db, schema)
}

export default createServiceFn(db)

class BaseService {
  constructor(db, schema) {
    ;(this.db = db), (this.schema = schema)
  }

  async getEntityById(id) {
    const entity = await db
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))
      .get()
    return entity
  }

  async getEntities() {
    const entities = await db.select().from(this.schema).all()
    return entities
  }

  async createEntity(entity) {
    const newEntity = await db
      .insert(this.schema)
      .values(entity)
      .returning()
      .get()
    return newEntity
  }

  async updateEntity(id, entity) {
    const updatedEntity = await this.db
      .update(this.schema)
      .set(entity)
      .where(eq(this.schema.id, id))
      .returning()
      .get()
    return updatedEntity
  }

  async deleteEntity(id) {
    const deletedEntity = await db
      .delete(this.schema)
      .where(eq(this.schema.id, id))
      .returning()
      .get()
    return deletedEntity
  }
}


