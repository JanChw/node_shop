import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { badRequestError } from '../utils/error.js'
import { validateReq } from '../middlewares/reqValidate.js'
import {
  CreateUserReqValidation,
  GetUserReqValidation,
  UpateUserReqValidation,
} from '../utils/validation.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/test', (req, res) => {
  throw badRequestError('test error handdler')
})

router
  .get('/users', UserController.getUsers)
  .get(
    '/users/:id',
    validateReq(...GetUserReqValidation, 'params'),
    UserController.getUserById
  )
  .post(
    '/user',
    validateReq(...CreateUserReqValidation),
    UserController.createUser
  )
  .put(
    '/users/:id',
    validateReq(...UpateUserReqValidation),
    UserController.updateUser
  )
  .delete('/users/:id', UserController.deleteUser)

export default router
