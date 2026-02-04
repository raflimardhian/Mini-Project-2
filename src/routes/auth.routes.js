const express = require('express')
const checkData = require('../middleware/checkData')
const router = express.Router()
const {registerSchema, loginSchema} = require('../validation/validation.auth')


function createAuthRoutes({authController}){
    router.post('/register',checkData(registerSchema), authController.register)
    router.post('/login', checkData(loginSchema), authController.login)
    router.post('/verify', authController.verify)

    return router
}

module.exports = createAuthRoutes