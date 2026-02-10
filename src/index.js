require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 4500
const swagger = require('swagger-ui-express')

const redisClient = require('./utils/redis')
const prisma = require('./db')
const generator = require('./utils/generated')
const nodemailer = require('./utils/mailer')
const midtrans = require('./utils/midtrans')
const swaggerDocument = require('../docs/swagger.json')

const createSecurity = require('./utils/security')
const createAuthMiddleware = require('./middleware/authentication')
const checkRole = require('./middleware/authorization')
const errorHandler = require('./utils/errorHandler')

const createUserRepository = require('./repository/user.repository')
const createProductRepository = require('./repository/product.repository')
const createOrderRepository = require('./repository/order.repository')
const createResellerRepository = require('./repository/reseller.repository')
const createEtalaseRepository = require('./repository/etalase.repository')
const createEtalaseProductRepository = require('./repository/etalaseProduct.repository')

const createAuthService = require('./services/auth.service')
const createUserService = require('./services/user.service')
const createProductService = require('./services/product.service')
const createOrderService = require('./services/order.service')
const createResellerService = require('./services/reseller.service')
const createEtalaseService = require('./services/etalase.service')
const createEtalaseProductService = require('./services/etelaseProduct.service')
const createPaymentService = require('./services/payment.service')

const createAuthController = require('./controller/auth.controller')
const createUserController = require('./controller/user.controller')
const createProductController = require('./controller/product.controller')
const createOrderController = require('./controller/order.controller')
const createResellerCotroller = require('./controller/reseller.controller')
const createEtalaseController = require('./controller/etalase.controller')
const createEtalaseProductController = require('./controller/etalaseProduct.controller')
const createPaymentController = require('./controller/payment.controller')

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const productRoutes = require('./routes/product.routes')
const orderRoutes = require('./routes/order.routes')
const resellerRoutes = require('./routes/reseller.routes')
const etalaseRoutes = require('./routes/etalase.routes')
const etalaseProductRoutes = require('./routes/etalaseProduct.routes')
const paymentRoutes = require('./routes/payment.routes')

const security = createSecurity()
const authMiddleware = createAuthMiddleware({security})

const userRepo = createUserRepository({db:prisma})
const productRepo = createProductRepository({db:prisma})
const orderRepo = createOrderRepository({db:prisma})
const resellerRepo = createResellerRepository({db:prisma})
const etalaseRepo = createEtalaseRepository({db:prisma})
const etalaseProductRepo = createEtalaseProductRepository({db:prisma})

const userService = createUserService({userRepo})
const authService = createAuthService({userRepo, security, generator, nodemailer})
const productService = createProductService({productRepo})
const orderService = createOrderService({orderRepo, db:prisma, midtrans})
const resellerService = createResellerService({resellerRepo, productRepo})
const etalaseService = createEtalaseService({etalaseRepo, redisClient})
const etalaseProductService = createEtalaseProductService({etalaseProductRepo, etalaseRepo, resellerRepo})
const paymentService = createPaymentService({orderRepo})

const authController = createAuthController({authService})
const userController = createUserController({userService})
const productController = createProductController({productService})
const orderController = createOrderController({orderService, midtrans})
const resellerController = createResellerCotroller({resellerService, productService})
const etalaseController = createEtalaseController({etalaseService})
const etalaseProductController = createEtalaseProductController({etalaseProductService})
const paymentController = createPaymentController({paymentService})

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/auth', authRoutes({authController}))
app.use('/users', userRoutes({userController, authMiddleware, checkRole}))
app.use('/product', productRoutes({productController, authMiddleware, checkRole}))
app.use('/orders', orderRoutes({orderController, authMiddleware, checkRole}))
app.use('/resell', resellerRoutes({resellerController, authMiddleware, checkRole}))
app.use('/etalase',etalaseRoutes({etalaseController, authMiddleware, checkRole}))
app.use('/etalaseProduct', etalaseProductRoutes({etalaseProductController, authMiddleware, checkRole}))
app.use('/payment', paymentRoutes({paymentController, authMiddleware}))
app.use('/api-docs', swagger.serve)
app.use('/api-docs', swagger.setup(swaggerDocument))

app.use(errorHandler)
module.exports = app

app.get('/', (req, res)=>{
    res.json({
        message:"Hello"
    })
})


app.listen(PORT, ()=>{
    console.log(`Listening to port: ${PORT}`);
})