const apiError = require('../utils/apiError')

function createEtalaseService({etalaseRepo, redisClient}){
    return{
        async findAll(){
            return etalaseRepo.findAll()
        },

        async findById(id){
            const cacheKey = `etalase:data:${id}`;
            const counterKey = `etalase:hit:${id}`;
            const HOT_THRESHOLD = 3; 
            const COUNTER_TTL = 3600

            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log(`[Redis] CACHE HIT - Etalase ID: ${id} is Hot Data!`);
                return JSON.parse(cachedData);
            }

            const currentHits = await redisClient.incr(counterKey);
            if (currentHits === 1) {
                await redisClient.expire(counterKey, COUNTER_TTL);
            }
            if(currentHits < HOT_THRESHOLD){
                console.log(`[Redis] CACHE MISS - Etalase ID: ${id} | Hits in last hour: ${currentHits}`);
            }
            
            const etalase = await etalaseRepo.findById(id)
            if (!etalase) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase not found",
                    {
                        expected: "Existing etalase id",
                        received: id
                    }
                )
            }
            if (currentHits >= HOT_THRESHOLD) {
                console.log(`[Redis] THRESHOLD PASSED - Promotion: Etalase ID ${id} is now cached as Hot Data!`);
                const exists = await redisClient.exists(cacheKey);
                if (!exists) {
                    console.log(`[Redis] PROMOTING to Hot Data: ID ${id}`);
                    await redisClient.setEx(cacheKey, 60, JSON.stringify(etalase));
                    await redisClient.del(counterKey); // Hapus counter karena sudah jadi Hot Data
                }
            }
            return etalase
        },

        async createEtalase(data){
            return etalaseRepo.create(data)
        },

        async updateEtalase(id, data){
            const existing = await etalaseRepo.findById(id)
            if (!existing) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase not found",
                    {
                        expected: "Existing etalase id",
                        received: id
                    }
                )
            }
            await redisClient.del(`etalase:data:${id}`);
            return etalaseRepo.update(id, data)
        },

        async deleteEtalase(id){
            const existing = await etalaseRepo.findById(id)
            if (!existing) {
                throw apiError(
                    404,
                    "NOT_FOUND",
                    "Etalase not found",
                    {
                        expected: "Existing etalase id",
                        received: id
                    }
                )
            }
            await redisClient.del(`etalase:data:${id}`);
            await redisClient.del(`etalase:hit:${id}`);

            return etalaseRepo.delete(id)
        }
    }
}

module.exports = createEtalaseService