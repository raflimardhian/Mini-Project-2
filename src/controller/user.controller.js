function createUserController({userService}){
    return{
        getAll: async(req, res, next)=>{
            try{
                const data = await userService.findAll()
                res.status(200).json({
                    success: true,
                    message: "Get all user data success",
                    user:data
                })
            } catch(error){
                next(error)
            }
        },

        getById: async(req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = await userService.findById(id)
                res.status(200).json({
                    success:true,
                    message: "Get data by user id success",
                    user:data
                })
            } catch(error){
                next(error)
            }
        },

        createUser: async(req, res, next)=>{
            try{
                const data  = req.body
                const newUser = await userService.createUser(data)
                res.status(201).json({
                    success:true,
                    message:"Create new user success",
                    user:newUser
                })
            }catch(error){
                next(error)
            }
        },

        updateUser: async (req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const data = req.body
                const updatedUser = await userService.updateUser(id, data)
                res.status(200).json({
                    success: true,
                    message: "Update user data success",
                    user:updatedUser
                })
            } catch(error){
                next(error)
            }
        },

        deleteUser: async (req, res, next)=>{
            try{
                const id = parseInt(req.params.id)
                const deletedUser = await userService.deleteUser(id)
                res.status(200).json({
                    success:true,
                    message:"User deleted successfully",
                    user:deletedUser
                })
            }catch(error){
                next(error)
            }
        }
    }
}

module.exports = createUserController