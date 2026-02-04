function createOrderRepository({db}){
    return{
        async findAll(){
            return await db.order.findMany()
        },

        async findById(id){
            return await db.order.findUnique({
                where:{
                    id:id
                },
                include:{
                    buyer:true,
                    resellerProduct:{
                        include:{
                            product:{
                                include:{
                                    owner:true
                                }
                            }
                        }
                    }
                }
            })
        },

        async create(data, tx = db){
            return await tx.order.create({
                data:{
                    buyerId: data.buyerId,
                    resellerProductId: data.resellerProductId,
                    quantity: data.quantity,
                    sellingPrice: data.sellingPrice,
                    basePrice: data.basePrice,
                    resellerCommission: data.resellerCommission,
                    status: data.status
                }
            })
        },

        async update(id, data){
            return await db.order.update({
                where:{
                    id:id
                },
                data:{
                    quantity: data.quantity,
                    sellingPrice: data.sellingPrice,
                    basePrice: data.basePrice,
                    resellerCommission: data.resellerCommission,
                    status: data.status
                },
                include:{
                    resellerProduct: true
                }
            })
        },

        async delete(id){
            return await db.order.delete({
                where:{
                    id:id
                }
            })
        }
    }
}

module.exports = createOrderRepository