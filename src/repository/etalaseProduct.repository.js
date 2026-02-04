function createEtalaseProductRepository({db}){
    return{
        async findAll(){
            return await db.etalaseProduct.findMany({
                include:{
                    resellerProduct: true,
                    etalase:{
                        select:{
                            name:true
                        }
                    }
                }
            })
        },

        async findById(id){
            return await db.etalaseProduct.findUnique({
                where:{
                    id:id
                }
            })
        },

        async create(data){
            return await db.etalaseProduct.create({
                data:{
                    etalaseId: data.etalaseId,
                    resellerProductId: data.resellerProductId
                }
            })
        },

        async update(id, data){
            return await db.etalaseProduct.update({
                where:{
                    id:id
                },
                data:{
                    etalaseId: data.etalaseId,
                    resellerProductId: data.resellerProductId
                }
            })
        },

        async delete(id){
            return await db.etalaseProduct.delete({
                where:{
                    id:id
                }
            })
        }
    }
}

module.exports = createEtalaseProductRepository