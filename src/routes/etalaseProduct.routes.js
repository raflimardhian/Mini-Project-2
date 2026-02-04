const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {createEtalaseProductschema} = require('../validation/validation.etalaseProduct')

function createEtalaseProductRoutes({etalaseProductController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, etalaseProductController.getAll)
    router.get('/:id', authMiddleware, etalaseProductController.getById)
    router.post('/', authMiddleware, checkRole(['ADMIN', 'RESELLER']), etalaseProductController.create)
    router.put('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), etalaseProductController.update)
    router.delete('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), etalaseProductController.delete)

    return router
}

module.exports = createEtalaseProductRoutes