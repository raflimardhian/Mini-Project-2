function createEtalaseProductController({etalaseProductService}){
    return{
        getAll: async (req, res, next)=>{
            try{
                const data = await etalaseProductService.findAll()
                res.status(200).json({
                    success: true,
                    message: "Get all etalase product success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        },

        getById: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await etalaseProductService.findById(id)
                res.status(200).json({
                    success: true,
                    message: "Get etalase product by id success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        },

        create: async (req, res, next)=>{
            try{
                const data = await etalaseProductService.create(req.body)
                res.status(201).json({
                    success: true,
                    message: "Create etalase product success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        },

        update: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await etalaseProductService.update(id, req.body)
                res.status(200).json({
                    success: true,
                    message: "Update etalase product success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        },

        delete: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await etalaseProductService.delete(id)
                res.status(200).json({
                    success: true,
                    message: "Delete etalase product success",
                    data: data
                })
            }catch(error){
                next(error)
            }
        }
    }
}

module.exports = createEtalaseProductController