function createEtalaseRepository({db}){
    return{
        async findAll(){
            return db.etalase.findMany({
                include:{
                    products:{
                        include:{
                            resellerProduct:{
                                include:{
                                    product: true
                                }
                            }
                        }
                    },
                    reseller: true
                },
                where:{
                    isActive: true
                }
            })
        },

        async findById(id){
            return db.etalase.findUnique({
                where:{
                    id:id
                },
                include:{
                    products:{
                        include:{
                            resellerProduct:{
                                include:{
                                    product:true
                                }
                            }
                        }
                    }
                }
            })
        },
        
        async create(data){
            return db.etalase.create({
                data:{
                    name: data.name,
                    resellerId: data.resellerId,
                    startAt: new Date(`${data.startAt}T00:00:00`),
                    endAt: new Date(`${data.endAt}T23:59:59`)
                }
            })
        },

        async update(id, data){
            return db.etalase.update({
                where:{
                    id:id
                },
                data:{
                    name: data.name,
                    isActive: data.isActive,
                    startAt: new Date(`${data.startAt}T00:00:00`),
                    endAt: new Date(`${data.endAt}T23:59:59`)
                }
            })
        },

        async delete(id){
            return db.etalase.delete({
                where:{
                    id:id
                }
            })
        }
    }
}


module.exports = createEtalaseRepository