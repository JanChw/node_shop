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
  age: z
    .number()
    .int()
    .gt(0, { message: '年龄不能小于0' })
    .lt(200, { message: '年龄超出实际范围' }),
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
  ['name', 'email', 'age'],
]

export const UpateUserReqValidation = [
  UpdateUserSchema,
  ['id', 'name', 'email', 'age'],
]

export const CreateProductReqValidation = [
  CreateProductScheama,
  ['name', 'price', 'description'],
]

export const UpdateProductReqValidation = [
  UpdateProductSchema,
  ['id', 'name', 'price', 'description'],
]
