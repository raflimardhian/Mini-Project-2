const express = require('express')
const router = express.Router()
const checkData = require('../middleware/checkData')
const {createUserSchema, updateUserSchema} = require('../validation/validation.user')
function createUserRoutes({userController, authMiddleware, checkRole}){
    router.get('/', authMiddleware, checkRole(['ADMIN']), userController.getAll)
    router.get('/:id', authMiddleware, userController.getById)
    router.put('/:id', authMiddleware, checkData(updateUserSchema), userController.updateUser)
    router.post('/', authMiddleware, checkRole(['ADMIN']), checkData(createUserSchema), userController.createUser)
    router.delete('/:id', authMiddleware, userController.deleteUser)

    return router
}

module.exports = createUserRoutes