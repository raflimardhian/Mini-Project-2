function createResellerRepository({db}){
    return{
        async findAll(){
            return await db.resellerProduct.findMany({
                include:{
                    reseller:{
                        select:{
                            email: true
                        }
                    },
                    product:true
                }
            })
        },

        async findById(id){
            return await db.resellerProduct.findUnique({
                where:{
                    id:id
                }
            })
        },

        async create(data){
            return await db.resellerProduct.create({
                data:{
                    resellerId: data.resellerId,
                    productId: data.productId,
                    basePrice: data.basePrice,
                    sellingPrice: data.basePrice,
                    isActive: data.isActive
                }
            })
        },

        async update(id, data){
            return await db.resellerProduct.update({
                where:{
                    id:id
                },
                data:{
                    productId: data.productId,
                    basePrice: data.basePrice,
                    sellingPrice: data.sellingPrice,
                    isActive: data.isActive
                }
            })
        },

        async delete(id){
            return await db.resellerProduct.delete({
                where:{
                    id:id
                }
            })
        }
    }
}

module.exports = createResellerRepository