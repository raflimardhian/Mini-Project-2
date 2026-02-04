function createUserController({authService}){
    return{
        register: async (req, res, next)=>{
            try{
                const data = await authService.register(req.body)
                res.status(201).json({
                    success:true,
                    message:"Register successfully",
                    user:data
                })
            } catch(error){
                next(error)
            }
        },
        login: async (req, res, next)=>{
            try{
                const {email, password} = req.body
                const data = await authService.login(email, password)
                res.status(200).json({
                    success:true,
                    message:"Login success",
                    user:data
                })
            } catch(error){
                next(error)
            }
        },
        verify: async (req, res, next) =>{
            try{
                const {email, otp} = req.body
                const user = await authService.verify(email, otp)
                res.status(200).json({
                    success: true,
                    message: "Verify Success",
                    use:user
                })
            }   catch(err){
                next(err)
            }
        }
    }
}

module.exports = createUserController