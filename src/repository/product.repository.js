function createProductRepository({db}){
    return{
        async findAll(){
            return await db.product.findMany()
        },
        
        async findById(id){
            return db.product.findUnique({
                where:{
                    id:id
                }
            })
        },

        async create(data){
            return db.product.create({
                data:{
                    name: data.name,
                    description: data.description,
                    basePrice: data.basePrice,
                    stock: data.stock,
                    ownerId: data.ownerId
                }
            })
        },

        async update(id, data){
            return await db.product.update({
                where:{
                    id:id
                },
                data:{
                    name: data.name,
                    description: data.description,
                    basePrice: data.basePrice,
                    stock: data.stock,
                    ownerId: data.ownerId
                }
            })
        },

        async delete(id){
            return await db.product.delete({
                where:{
                    id:id
                }

            })
        }
    }
}

module.exports = createProductRepository