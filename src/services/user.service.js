const apiError = require('../utils/apiError')
function createUserService({userRepo}){
    return{
        async findAll(){
            const data = await userRepo.findAll()
            return data
        },

        async findById(id){
            const data  = await userRepo.findById(id)
            if (!data) {
                throw apiError(
                404,
                "NOT_FOUND",
                "User not found",
                {
                    expected: "Existing user id",
                    received: id
                }
                )
            }
            return data
        },

        async createUser(data){
            const newData = {...data}
            const user = await userRepo.create(newData)
            return user
        },

        async updateUser(id, data){
            const updatedUser = await userRepo.findById(id)
            if (!updatedUser) {
                throw apiError(
                404,
                "NOT_FOUND",
                "User not found",
                {
                    expected: "Existing user id",
                    received: id
                }
                )
            }
            return await userRepo.update(id,data)
        },
        
        async deleteUser(id){
            const deletedUser = await userRepo.findById(id)
            if (!deletedUser) {
                throw apiError(
                404,
                "NOT_FOUND",
                "User not found",
                {
                    expected: "Existing user id",
                    received: id
                }
                )
            }
            return await userRepo.delete(id)
        }
    }
}

module.exports = createUserService