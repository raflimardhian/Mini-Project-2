const apiError = require('../utils/apiError')

function createResellerService({resellerRepo, productRepo}){
    return{
        async findAll(){
            const data = await resellerRepo.findAll()
            return data
        },

        async findById(id){
            const reseller = await resellerRepo.findById(id)
            const resellerProduct = await resellerRepo.findAll()
            if(!reseller){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Between 1-${resellerProduct.length}`, received: id})
            }
            

            return reseller
        },

        async create(data){
            const {productId, basePrice } = data
            if (!productId || !basePrice) {
                throw apiError(
                400,
                "VALIDATION_ERROR",
                "Missing required fields",
                {
                    expected: ["resellerId", "productId", "basePrice", "sellingPrice"],
                    received: Object.keys(data)
                }
                )
            }
            const dataProduct = await productRepo.findById(productId)
            const product = await productRepo.findAll()
            if(!dataProduct){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Between 1-${product.length}`, received: data.productId})
            }
            return await resellerRepo.create(data)
        },

        async update(id, data){
            const idData = await resellerRepo.findById(id)
            const resellerProduct = await resellerRepo.findAll()
            if(!idData){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Between 1-${resellerProduct.length}`, received: id})
            }
            return await resellerRepo.update(id, data)
        },

        async delete(id){
            return await resellerRepo.delete(id)
        }
    }
}

module.exports = createResellerService