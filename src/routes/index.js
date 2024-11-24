import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { badRequestError } from '../utils/error.js'


const router = Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/test', (req, res) => {
    throw badRequestError('test error handdler')
  })

router 
    .get('/users', UserController.getUsers)
    .get('/users/:id', UserController.getUserById)
    .post('/user', UserController.createUser)
    .put('/users/:id', UserController.updateUser)
    .delete('/users/:id', UserController.deleteUser)

export default router