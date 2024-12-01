
import UserService from "../services/user.service.js"
export default {
  getUsers: async (req, res) => {
    const users = await UserService.getEntities()
    return res.json(users)
  },

  getUserById: async (req, res) => {
    const user = await UserService.getEntityById(req.params.id)
    return res.json(user)
  },
// TODO: validateData == validateBodyData
  createUser: async (req, res) => {
    const newUser = await UserService.createEntity(req.validatedData)
    return res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: newUser,
    })
  },

  updateUser: async (req, res) => {
    const updatedUser = await UserService.updateEntity(
     req.params.id,
     req.validatedData
    )
    return res.json(updatedUser)
  },

  deleteUser: async (req, res) => {
    const deletedUser = await UserService.deleteEntity(req.params.id)
    return res.json(deletedUser)
  },

  resetPassword: async (req, res) => {
    // const resetUser = await UserService.resetPassword(req.params.id)
    // return res.json(resetUser)
  },

  verifyEmail: async (req, res) => {
    // const validateUser = await UserService.validateEmail(req.params.id)
    // return res.json(validateUser)
  },
}
