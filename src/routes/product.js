import router from './initRoute.js'
import ProductController from '../controllers/product.controller.js'
import { validateReq } from '../middlewares/reqValidate.js'
import {
  CreateProductReqValidation,
  UpdateProductReqValidation,
} from '../utils/validation.js'


router
  .get('/products', ProductController.getProducts)
  .get('/products/:id',ProductController.getProductById)
  .post(
    '/product',
    validateReq(...CreateProductReqValidation),
    ProductController.createProduct
  )
  .put(
    '/products/:id',
    validateReq(...UpdateProductReqValidation),
    ProductController.updateProduct
  )
  .delete('/products/:id', ProductController.deleteProduct)


