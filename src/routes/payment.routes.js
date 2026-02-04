const express = require('express')
const router = express.Router()

function createPaymentRoutes({paymentController, authMiddleware}){
    router.post('/callback', paymentController.callback)
    router.post('/:id', authMiddleware, paymentController.create)

    return router
}

module.exports = createPaymentRoutes