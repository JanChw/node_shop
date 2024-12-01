import UserService from "../services/user.service.js"
import { badRequestError, notFoundError } from "../utils/error.js";
import jwt from "jsonwebtoken"
export async function login(req, res, next) {
    let { username, password, email } = req.body
    let _username = username ?? email
    if (!_username) {
        return next(notFoundError('用户名或邮箱不能为空'))
    }
    if (!password) {
        return next(notFoundError('密码不能为空'))
    }
    let user = await UserService.login(_username, password)

    const token = await jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_SECRET)

    return res.json({
        success: true,
        message: '登录成功',
        data: { token }
    })
}

// TODO: 数据校验 邮箱校验 SSE/WebSocket通知邮件发送情况
export async function signup(req, res, next) {
    let { name, password, email, age } = req.body
    let user = await UserService.signup({name, password, email, age})
    return res.json({
        success: true,
        message: '注册成功,并在1小时内激活注册邮箱',
        data: user
    })
    
}

export async function activateEmail(req, res, next) {
    let code = req.params.code
    let result = await UserService.activateEmail(code)

    return res.json({
        success: true,
        message: '邮箱激活成功',
        data: result
    })
    
    
}

export async function sendResetPasswordLink(req, res, next) {
    const {email} = req.user
    const result = await UserService.sendResetPasswordLink(email)
    return res.json({
        success: true,
        message: '重置密码邮件已发送',
        data: result
    })
}

export async function resetPassword(req, res, next) {
    let { password, password_confirmation } = req.body
    if (password!== password_confirmation) {
        return next(badRequestError('密码不一致'))
    }

    let code = req.params.code
    const result = await UserService.resetPassword(code, password)
    return res.json({
        success: true,
        message: '重置密码成功',
        data: result
    })
}


  