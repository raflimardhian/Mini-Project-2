const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {createOrderSchema} = require('../validation/validation.order')

function createOrderRoutes({orderController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, checkRole(['ADMIN']), orderController.getAll)
    router.get('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER', 'OWNER']), orderController.getById)
    router.post('/', authMiddleware, checkData(createOrderSchema), orderController.createOrder)
    router.put('/:id', authMiddleware, orderController.updateOrder)
    router.delete('/:id', authMiddleware, checkRole(['ADMIN']), orderController.deleteOrder)

    return router
}

module.exports = createOrderRoutes