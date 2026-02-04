const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {createProductSchema, updateProductSchema} = require('../validation/validation.product')

function createProductRoutes({productController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, productController.getAll)
    router.get('/:id', authMiddleware, productController.getById)
    router.put('/:id', authMiddleware, checkRole(['ADMIN', 'OWNER']),checkData(updateProductSchema), productController.updateProduct)
    router.post('/', authMiddleware, checkRole(['ADMIN', 'OWNER']),checkData(createProductSchema), productController.createProduct)
    router.delete('/:id', authMiddleware, checkRole(['ADMIN']), productController.deleteProduct)

    return router
}

module.exports = createProductRoutes