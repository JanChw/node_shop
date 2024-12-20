import { z } from 'zod'
const IDSchema = z.object({
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

const CreateUserSchema = z.object({
  name: z.string().min(1, { message: '用户名不能为空' }),
  email: z.string().email({ message: '邮箱格式不正确' }),
  password: z.string().min(6, { message: '密码长度不能小于6' }),
  age: z
    .number()
    .int()
    .gt(0, { message: '年龄不能小于0' })
    .lt(200, { message: '年龄超出实际范围' }),
})

const LoginSchema = z.object({
  username: z.string({message: '用户名不能为空' })
            .email({ message: '邮箱或用户名格式不正确' })
            .or(z.string().min(3, {message: '用户名不能小于3'})),
  password: z.string().min(6, { message: '密码长度不能小于6' })
  })

const UpdateUserSchema = z.object({
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

const CreateProductScheama = z.object({
  name: z.string().min(1, { message: '用户名不能为空' }),
  price: z.number().gt(0, { message: '价格不能小于0' }),
  description: z.string().min(1, { message: '描述不能为空' }),
})

const UpdateProductSchema = z.object({
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
  price: z.number().gt(0, { message: '价格不能小于0' }).optional(),
  description: z.string().min(1, { message: '描述不能为空' }).optional(),
})

export const GetUserReqValidation = [IDSchema, ['id']]

export const CreateUserReqValidation = [
  CreateUserSchema,
  ['name', 'email', 'age', 'password'],
]

export const UpateUserReqValidation = [
  UpdateUserSchema,
  ['id', 'name', 'email', 'age'],
]

export const LoginReqValidation = [
  LoginSchema,
  ['username', 'password'],
]

export const CreateProductReqValidation = [
  CreateProductScheama,
  ['name', 'price', 'description'],
]

export const UpdateProductReqValidation = [
  UpdateProductSchema,
  ['id', 'name', 'price', 'description'],
]
