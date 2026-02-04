const apiError = require('../utils/apiError')

function createResellerCotroller({resellerService, productService}){
    return{
        getAll: async(req, res, next)=>{
            try{
                const data = await resellerService.findAll()
                res.status(200).json({
                    success: true,
                    message: "Get all reseller product success",
                    data:data
                })
            }catch(err){
                next(err)
            }
        },

        getById: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await resellerService.findById(id)
                res.status(200).json({
                    success: true,
                    message: "Get reseller product by id success",
                    data: data
                })
            }catch(err){
                next(err)
            }
        },

        createProduct: async(req, res, next)=>{
            try{
                const resellerId = parseInt(req.user.id)
                const data = await resellerService.create({...req.body, resellerId})
                res.status(201).json({
                    success: true,
                    message: "Create reseller product success",
                    data: data
                })
            }catch(err){
                next(err)
            }
        },

        updateProduct: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data  = await resellerService.update(id, req.body)
                res.status(200).json({
                    success: true,
                    message: "Update reseller product success",
                    data: data
                })
            }catch(err){
                next(err)
            }
        },

        deleteProduct: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await resellerService.delete(id)
                res.status(200).json({
                    success: true,
                    message: "Delete product from reseller success",
                    data: data
                })
            }catch(err){
                next(err)
            }
        }
    }
}

module.exports = createResellerCotroller