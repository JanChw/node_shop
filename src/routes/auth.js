import router from './initRoute.js'
import { activateEmail, login,resetPassword,sendResetPasswordLink,signup } from '../controllers/auth.controller.js'

router.post('/auth/login', login)
router.post('/auth/signup', signup)
router.get('/auth/verify/email/:code', activateEmail)
router.get('/auth/send/email', sendResetPasswordLink)
router.post('/auth/reset/password/:code', resetPassword)