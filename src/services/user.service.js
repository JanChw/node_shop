import { UserTable } from '../db/schema.js'
import { sqlite as db, redis } from '../db/index.js'
import { badRequestError, forbiddenError, notFoundError } from '../utils/error.js'
import { BaseService } from './base.service.js'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { tasks } from '../common/task.js'
import { sendMail } from '../common/mail.js'

class UserService extends BaseService {
  constructor(db, schema) {
    super(db, schema)
  }

  async login(user, password) {
    const _user = await this.db.query['UserTable'].findFirst({
      where: or(eq(UserTable.name, user), eq(UserTable.email, user)),
    })

    if (!_user) throw notFoundError('用户不存在')

    const match = await bcrypt.compare(password, _user.password)
    if (!match) throw badRequestError('密码错误')

    return _user
  }

  async signup(user) {
    console.log('signup', user)
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    const newEntity = await this.db
      .insert(this.schema)
      .values(user)
      .returning()
      .get()

      
    tasks.add('send_mail', {email: user.email})
    
    return newEntity
  }

  async activateEmail(code) {
    const email = await redis.get(`email:unactivated:${code}`)
    console.log(email)
    if (!email) throw forbiddenError('激活码不存在或已过期')

    const user = await this.db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
    })

    if (!user) throw notFoundError('用户不存在')

    return this.db.update(UserTable).set({
      email_verified: 1,
    }).where(eq(UserTable.email, email)).then(() => {
      redis.del(`email:unactivated:${code}`)
    })



  }
  async sendResetPasswordLink(email){
    let code = uuidv4()
    const link = `http://localhost:3000/v1/api/auth/reset/password/${code}`
    redis.set(`password:reset:${code}`, email, 60 * 60)
    sendMail(email, link)
  }

  async resetPassword(code, password) {
    const email = await redis.get(`password:reset:${code}`)
    if (!email) throw forbiddenError('重置密码链接不存在或已过期')

    const hashedPassword = await bcrypt.hash(password, 10)
    return this.db.update(UserTable).set({
      password: hashedPassword,
    }).where(eq(UserTable.email, email)).then(() => {
      redis.del(`password:reset:${code}`)
    })
  }
}

export default new UserService(db, UserTable)


