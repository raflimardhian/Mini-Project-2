const apiError = require('../utils/apiError')
const snap = require('../utils/midtrans')
const {publishToQueue} = require('../queue/producer')


function createPaymentService({orderRepo}){
    return{
        async createMidtransTransaction(orderId, user){
            const order = await orderRepo.findById(orderId)

            if(!order){
                throw apiError(404, "NOT_FOUND", 'Order not found')
            }

            if(order.status === 'PAID'){
                throw apiError(400, 'BAD_REQUEST', 'Order already paid')
            }

            const grossAmount = order.sellingPrice * order.quantity

            const parameter ={
                transaction_details:{
                    order_id:`ORDER-${order.id}`,
                    gross_amount:grossAmount
                },
                customer_details:{
                    email:user.email
                }
            }
            return snap.createTransaction(parameter)
        },

        async handleNotification(notification){
            try{
                const result = await snap.transaction.notification(notification)

                const orderId = parseInt(result.order_id.replace('ORDER-',''))

                if (!['settlement', 'capture'].includes(result.transaction_status)) {
                    return result
                }

                

                const order = await orderRepo.findById(orderId)

                if (order.status === 'PAID') {
                    return result
                }
                const ownerCommission = (order.basePrice * order.quantity) - order.resellerCommission

                await orderRepo.update(orderId, {status: 'PAID'})
                await publishToQueue('order_payment', {
                    orderId:order.id,
                    resellerId:order.resellerProduct.resellerId,
                    owner:order.resellerProduct.product.owner.id,
                    emailBuyer:order.buyer.email,
                    resellerCommission:order.resellerCommission,
                    ownerCommission
                })
                return result
            }catch(err){
                throw err
            }
            
        }
    }
}

module.exports = createPaymentService