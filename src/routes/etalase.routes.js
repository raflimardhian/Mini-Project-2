const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {createEtalaseSchema, updateEtalaseSchema} = require('../validation/validation.etalase')

function createEtalaseRoutes({etalaseController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, etalaseController.getAll)
    router.get('/:id', authMiddleware, etalaseController.getById)
    router.post('/', authMiddleware, checkRole(['ADMIN', 'RESELLER']), checkData(createEtalaseSchema), etalaseController.createEtalase)
    router.put('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), checkData(updateEtalaseSchema), etalaseController.updateEtalase)
    router.delete('/:id', authMiddleware, checkRole(['ADMIN', 'RESELLER']), etalaseController.deleteEtalase)
    
    return router
}

module.exports = createEtalaseRoutes