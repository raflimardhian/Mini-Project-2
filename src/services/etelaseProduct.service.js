const apiError = require('../utils/apiError')

function createEtalaseProductService({etalaseProductRepo, etalaseRepo, resellerRepo}){
    return{
        async findAll(){
            return etalaseProductRepo.findAll()
        },

        async findById(id){
            const data = await etalaseProductRepo.findById(id)
            if (!data) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase product not found",
                    {
                        expected: "Existing etalase product id",
                        received: id
                    }
                )
            }
            return data
        },

        async create(data){
            const { etalaseId, resellerProductId } = data

            if (!etalaseId || !resellerProductId) {
                throw apiError(
                400,
                "VALIDATION_ERROR",
                "Missing required field",
                {
                    expected: ["etalaseId", "resellerProductId"],
                    received: Object.keys(data)
                }
                )
            }
            const etalase = await etalaseRepo.findById(etalaseId)
            if (!etalase) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase not found",
                    {
                        expected: "Existing etalase id",
                        received: etalaseId
                    }
                )
            }
            const resellerProduct = await resellerRepo.findById(resellerProductId)
            if (!resellerProduct) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Reseller product not found",
                    {
                        expected: "Existing reseller product id",
                        received: resellerProductId
                    }
                )
            }
            if (etalase.resellerId !== resellerProduct.resellerId) {
                throw apiError(
                    403,
                    "FORBIDDEN",
                    "Etalase and product belong to different resellers",
                    {
                        expected: "Same resellerId",
                        received: {
                        etalaseResellerId: etalase.resellerId,
                        resellerProductResellerId: resellerProduct.resellerId
                        }
                    }
                )
            }
            return etalaseProductRepo.create(data)
        },

        async update(id, data){
            const existing = await etalaseProductRepo.findById(id)
            if (!existing) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase product not found",
                    {
                        expected: "Existing etalase product id",
                        received: id
                    }
                )
            }
            return etalaseProductRepo.update(id, data)
        },

        async delete(id){
            const existing = await etalaseProductRepo.findById(id)
            if (!existing) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase product not found",
                    {
                        expected: "Existing etalase product id",
                        received: id
                    }
                )
            }
            return etalaseProductRepo.delete(id)
        }
    }
}

module.exports = createEtalaseProductService