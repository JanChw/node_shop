import nodemailer from 'nodemailer'

export function sendMail(email, href) {
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