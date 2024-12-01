import ProductService from '../services/product.service.js'

export default {
  getProducts: async (req, res) => {
    const products = await ProductService.getEntities()
    return res.json({
      success: true,
      message: '获取数据成功',
      data: products,
    })
  },

  getProductById: async (req, res) => {
    const product = await ProductService.getEntityById(req.params.id)
    return res.json({
      success: true,
      message: '获取数据成功',
      data: product,
    })
  },
  // TODO: validateData == validateBodyData
  createProduct: async (req, res) => {
    const newProduct = await ProductService.createEntity(req.validatedData)
    return res.status(201).json(newProduct)
  },

  updateProduct: async (req, res) => {
    const updatedProduct = await ProductService.updateEntity(
      req.params.id,
      req.validatedData
    )
    return res.json(updatedProduct)
  },

  deleteProduct: async (req, res) => {
    const deletedProduct = await ProductService.deleteEntity(req.params.id)
    return res.json(deletedProduct)
  },
}
