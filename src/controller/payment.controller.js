function createPaymentController({paymentService}){
    return{
        create: async(req, res, next)=>{
            try{
                const transaction = await paymentService.createMidtransTransaction(
                    parseInt(req.params.id),
                    req.user
                )
                res.status(201).json({
                    success: true,
                    token: transaction.token,
                    redirect_url: transaction.redirect_url
                })
            }catch(err){
                next(err)
            }
        },

        callback: async(req, res, next)=>{
            try{
                await paymentService.handleNotification(req.body)
                res.status(200).json({success:true})
            }catch(err){
                next(err)
            }
        }
    }
}

module.exports = createPaymentController