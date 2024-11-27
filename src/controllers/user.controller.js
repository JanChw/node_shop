
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
    const newUser = await UserService.createEntiy(req.validatedData)
    return res.status(201).json(newUser)
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
}
