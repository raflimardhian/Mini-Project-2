const { resellerProduct, product, commissionLog } = require("../db")

function createUserRepository ({db}){
    return{
        async findAll(){
            return await db.user.findMany({
                include:{
                    orders: true,
                    commissionHistory: true
                }
            })
        },

        async findById(id){
            return await db.user.findUnique({
                where:{
                    id:id
                },
                include:{
                    resellerProducts: {
                        include:{
                            product: true
                        }
                    },
                    commissionHistory: true
                }
            })
        },

        async findByEmail(email){
            return await db.user.findUnique({
                where:{
                    email: email
                }
            })
        },

        async create(data){
            return await db.user.create({
                data:{
                    email: data.email,
                    password: data.password,
                    otp: data.otp,
                    otpExpiredAt: data.otpExpiredAt,
                    role: data.role
                }
            })
        },

        async update(id, data){
            return await db.user.update({
                where:{
                    id:id
                },
                data:{
                    email: data.email,
                    role: data.role
                }
            })
        },

        async verify(id){
            return await db.user.update({
                where:{
                    id:id
                },
                data:{
                    verified:true,
                    otp:null,
                    otpExpiredAt: null
                }
            })
        },

        async delete(id){
            return await db.user.delete({
                where:{
                    id:id
                }
            })
        }
    }
}

module.exports = createUserRepository