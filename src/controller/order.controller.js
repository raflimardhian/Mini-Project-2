function createOrderController({orderService}){
    return{
        getAll: async (req, res, next)=>{
            try{
                const data  =  await orderService.findAll()
                res.status(200).json({
                    success: true,
                    message: "Get all order data success",
                    data:data
                })
            }catch(error){
                next(error)
            }
            
        },

        getById: async (req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data  = await orderService.findById(id)
                res.status(200).json({
                    success: true,
                    message: "Get order data by id success",
                    data:data
                })
            }catch(error){
                next(error)
            }
            
        },

        createOrder: async(req, res, next)=>{
            try{
                const buyerId = parseInt(req.user.id)
                const data = await orderService.createOrder({...req.body, buyerId})
                res.status(201).json({
                    success: true,
                    message: "Create order successfully",
                    data: data
                })
            }catch(error){
                next(error)
            }
            
        },

        updateOrder: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await orderService.updateOrder(id, req.body)
                res.status(200).json({
                    success: true,
                    message: "Update order success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        },

        deleteOrder: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await orderService.deleteOrder(id)
                res.status(200).json({
                    success: true,
                    message: "Delete successfully",
                    data: data
                })
            } catch(error){
                next(error)
            }
        }
    }
}

module.exports = createOrderController