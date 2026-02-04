const {publishToQueue} = require('../queue/producer')

function createOrderService({orderRepo, db}){
    return{
        async findAll(){
            return await orderRepo.findAll()
        },

        async findById(id){
            const order = await orderRepo.findById(id)
            
            return order
        },

        async createOrder(data){
            return db.$transaction(async(tx)=>{
                const resellerProduct = await tx.resellerProduct.findUnique({
                    where:{
                        id: data.resellerProductId
                    },
                    include:{
                        product: true
                    }
                })

                if(!resellerProduct || !resellerProduct.isActive){
                    throw new Error("Stock not availale")
                }

                if(resellerProduct.product.stock < data.quantity){
                    throw new Error("Stock not enough")
                }

                const commission = (resellerProduct.basePrice * 0.1) * data.quantity
                
                const order = await orderRepo.create({
                    buyerId: data.buyerId,
                    resellerProductId: data.resellerProductId,
                    quantity: data.quantity,
                    sellingPrice: resellerProduct.sellingPrice,
                    basePrice: resellerProduct.basePrice,
                    resellerCommission: commission,
                }, tx)
                // await tx.user.update({
                //     where:{
                //         id:resellerProduct.resellerId
                //     },
                //     data:{
                //         balanceCommission:{
                //             increment: commission
                //         }
                //     }
                // })
                await tx.commissionLog.create({
                    data: {
                        userId: resellerProduct.resellerId,
                        orderId: order.id,
                        amount: commission,
                        type: "PENDING",
                    },
                });
                await tx.product.update({
                    where:{
                        id:resellerProduct.productId
                    },
                    data:{
                        stock:{
                            decrement: data.quantity
                        }
                    }
                })
                return order
            })
        },

        async updateOrder(id, data){
            const updatedOrder = await orderRepo.update(id, data)
            console.log(`Ini data update:${updatedOrder}`);
            
            if (data.status === 'PAID') {
                // if (!updatedOrder.resellerProduct) {
                //     const orderInfo = await orderRepo.findById(id);
                //     updatedOrder.resellerProduct = orderInfo.resellerProduct;
                // }                
                await publishToQueue('order_paid', {
                    orderId: updatedOrder.id,
                    resellerId: updatedOrder.resellerProduct.resellerId,
                    commission: updatedOrder.resellerCommission
                });
            }

            return updatedOrder;
        },

        async deleteOrder(id){
            return await orderRepo.delete(id)
        }
    }
}

module.exports = createOrderService