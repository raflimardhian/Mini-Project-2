function createProductController({productService}){
    return{
        getAll:async(req, res, next)=>{
            try{
                const data = await productService.findAll()
                res.status(200).json({
                    success: true,
                    messsage: "Get all product success",
                    product: data
                })
            }catch(error){
                next(error)
            }
        },

        getById:async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                if(!id){
                    throw new Error("Product not found")
                }
                const data = await productService.findById(id)
                res.status(200).json({
                    success: true,
                    messsage: "Get data by id success",
                    product: data
                })
            }catch(error){
                next(error)
            }
        },

        createProduct: async (req, res, next)=>{
            try{
                const ownerId = parseInt(req.user.id)
                const data = await productService.createProduct({...req.body, ownerId})
                res.status(201).json({
                    success: true,
                    messsage: "Create product successfully",
                    product: data
                })
            }catch(error){
                next(error)
            }
        },

        updateProduct: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const updatedData = await productService.updateProduct(id, req.body)
                res.status(200).json({
                    success: true,
                    message: "Updated product successfully",
                    product: updatedData
                })
            }catch(error){
                next(error)
            }
        },

        deleteProduct: async (req, res, next)=>{
            const id = parseInt(req.params.id)
            const deletedProduct = await productService.deleteProduct(id)
            res.status(200).json({
                success: true,
                message: "Deleted successfully",
                product: deletedProduct
            })
        }
    }
}

module.exports = createProductController