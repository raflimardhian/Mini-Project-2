const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {createResellerProductSchema, updateResellerProductSchema} = require('../validation/validation.reseller')

function createResellerRoutes({resellerController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, resellerController.getAll)
    router.get('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), resellerController.getById)
    router.put('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), checkData(updateResellerProductSchema), resellerController.updateProduct)
    router.post('/', authMiddleware, checkRole(['ADMIN', 'RESELLER']), checkData(createResellerProductSchema), resellerController.createProduct)
    router.delete('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), resellerController.deleteProduct)
    
    return router
}

module.exports = createResellerRoutes