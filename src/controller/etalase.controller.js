function createEtalaseController({etalaseService}){
    return{
        getAll: async(req, res, next)=>{
            try{
                const data =  await etalaseService.findAll()
                res.status(200).json({
                    success: true,
                    message: "Get all etalase success",
                    etalase: data
                })
            }catch(error){
                next(error)
            }
        },

        getById: async (req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await etalaseService.findById(id)

                const response = {
                    id: data.id,
                    name: data.name,
                    isActive: data.isActive,
                    startAt: data.startAt,
                    endAt: data.endAt,
                    products: data.products.map(item => ({
                        resellerProductId: item.resellerProduct.id,
                        productId: item.resellerProduct.product.id,
                        name: item.resellerProduct.product.name,
                        price: item.resellerProduct.sellingPrice,
                        stock: item.resellerProduct.product.stock
                    }))
                }

                res.status(200).json({
                    success: true,
                    message: "Get etalase by id success",
                    etalase: response
                })
            }catch(error){
                next(error)
            }
        },

        createEtalase: async(req, res, next)=>{
            try{
                const resellerId = parseInt(req.user.id)
                const data =  await etalaseService.createEtalase({...req.body, resellerId})
                res.status(201).json({
                    success:true,
                    messsage: "Create etalase success",
                    data:data
                })
            }catch(error){
                next(error)
            }
        },

        updateEtalase: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await etalaseService.updateEtalase(id, req.body)
                res.status(200).json({
                    success: true,
                    message: "Update etalase success",
                    data:data
                })
            }catch(error){
                next(error)
            }
        },

        deleteEtalase: async(req, res, next)=>{
            try{
                const id = parsei(req.params.id)
                const data = await etalaseService.deleteEtalase(id)
                res.status(200).json({
                    success: true,
                    message: "Delete etalase success",
                    deletedEtalase: data
                })
            }catch(error){
                next(error)
            }
        }
    }
}

module.exports = createEtalaseController