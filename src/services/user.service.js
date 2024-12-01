import { usersTable } from '../db/schema.js'
import { sqlite as db, redis } from '../db/index.js'
import { badRequestError, forbiddenError, notFoundError } from '../utils/error.js'
import { BaseService } from './base.service.js'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import nodemailer from 'nodemailer'

class UserService extends BaseService {
  constructor(db, schema) {
    super(db, schema)
  }

  async login(user, password) {
    const _user = await this.db.query['usersTable'].findFirst({
      where: or(eq(usersTable.name, user), eq(usersTable.email, user)),
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
    console.log(user)
    const newEntity = await this.db
      .insert(this.schema)
      .values(user)
      .returning()
      .get()
    // TODO: 使用任务队列
    const code = uuid()
    redis.set(`email:unactivated:${code}`, user.email, 'EX', 60 * 60)
    const result = await redis.get(`email:unactivated:${code}`)
    console.log(result)
    const href = `http://localhost:3000/v1/api/auth/verify/email/${code}`
    sendMail(user.email, href).then(() => logger.info('邮件发送成功')).catch((err) => logger.error(err))
    
    return newEntity
  }

  async activateEmail(code) {
    const email = await redis.get(`email:unactivated:${code}`)
    console.log(email)
    if (!email) throw forbiddenError('激活码不存在或已过期')

    const user = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })

    if (!user) throw notFoundError('用户不存在')

    return this.db.update(usersTable).set({
      email_verified: 1,
    }).where(eq(usersTable.email, email)).then(() => {
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
    return this.db.update(usersTable).set({
      password: hashedPassword,
    }).where(eq(usersTable.email, email)).then(() => {
      redis.del(`password:reset:${code}`)
    })
  }
}

export default new UserService(db, usersTable)

function sendMail(email, href) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_AUTH_CODE,
    },
  })
  
  
  logger.info(href)
  let mailOptions = {
    from: process.env.MAIL_USER, // 发件人地址
    to: email, // 收件人地址
    subject: '邮箱激活', // 邮件主题
    text: `邮箱激活`, // 邮件正文（纯文本）
    html: `<b><a href="${href}">邮箱激活验证</a></b>`, // 邮件正文（HTML格式）
  }

  return transporter.sendMail(mailOptions)
}
