import { z } from 'zod'
export const UserIdSchema = z.object({
  id: z
    .string()
    .transform((id) => parseInt(id))
    .pipe(
      z
        .number()
        .int({ message: 'id参数不合法' })
        .positive({ message: 'id参数不合法' })
    ),
})

export const GetUserReqValidation = [UserIdSchema, ['id']]

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: '用户名不能为空' }),
  email: z.string().email({ message: '邮箱格式不正确' }),
  age: z
    .number()
    .int()
    .gt(0, { message: '年龄不能小于0' })
    .lt(200, { message: '年龄超出实际范围' }),
})

export const CreateUserReqValidation = [
  CreateUserSchema,
  ['name', 'email', 'age'],
]

export const UpdateUserSchema = z.object({
  id: z
    .string({ message: '参数不合法' })
    .transform((id) => parseInt(id))
    .pipe(
      z
        .number({ message: 'id参数不合法' })
        .int()
        .positive({ message: 'id参数不合法' })
    ),
  name: z.string().min(1, { message: '用户名不能为空' }).optional(),
  email: z.string().email({ message: '邮箱格式不正确' }).optional(),
  age: z
    .number()
    .int()
    .gt(0, { message: '年龄不能小于0' })
    .lt(200, { message: '年龄超出实际范围' })
    .optional(),
})

export const UpateUserReqValidation = [
  UpdateUserSchema,
  ['id', 'name', 'email', 'age'],
]
