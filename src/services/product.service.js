const apiError = require('../utils/apiError')

function createProductService({productRepo}){
    return{
        async findAll(){
            const data = await productRepo.findAll()
            return data
        },

        async findById(id){
            const data = await productRepo.findById(id)
            if(!data){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Existing product id`, received: id})
            }
            return data
        },

        async createProduct(data){
            const { name, basePrice, stock, ownerId } = data
            if(!name || !basePrice || !stock || !ownerId){
                throw apiError(400, "VALIDATION_ERROR", "Missing required field", {expected: ["name", "basePrice", "stock", "ownerId"], received: Object.keys(data)})
            }
            if (basePrice <= 0 || stock < 0) {
                throw apiError(400, "INVALID_VALUE", "Invalid price or stock",{expected: "basePrice > 0 & stock >= 0",received: { basePrice, stock }}
                )
            }
            return await productRepo.create(data)
        },

        async updateProduct(id, data){
            const updatedProduct = await productRepo.findById(id)
            if(!updatedProduct){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Existing product id`, received: id})
            }
            if(!data){
                throw apiError(400, "VALIDATION_ERROR", "Missing required field", "fill all required field")
            }
            const dataProduct = await productRepo.update(id, data)
            return dataProduct
        },

        async deleteProduct(id){
            const data = await productRepo.delete(id)
            const updatedProduct = await productRepo.findById(id)
            if(!updatedProduct){
                throw apiError(404, "NOT_FOUND", "Product id not found", {expected: `Existing product id`, received: id})
            }
            return data
        }
    }
}

module.exports = createProductService