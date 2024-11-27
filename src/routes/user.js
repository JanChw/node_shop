import router from './initRoute.js'
import UserController from '../controllers/user.controller.js'
import { validateReq } from '../middlewares/reqValidate.js'
import {
  CreateUserReqValidation,
  GetUserReqValidation,
  UpateUserReqValidation,
} from '../utils/validation.js'



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


