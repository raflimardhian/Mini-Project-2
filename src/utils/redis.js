const { createClient } = require("redis");
// const logger = require("./logger");

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({
    url: REDIS_URL,
    socket: {
        tls:true,
        connectTimeout:10000,
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error("Redis reconnection failed");
            return Math.min(retries * 50, 2000);
        }
    }
});

client.on("error", (err) => {
    console.log("Redis Client Error", err);
});

let isConnected = false;

const connnectRedis = async () => {
    if(!isConnected){
        try {
            await client.connect();
            console.log("Connected to Redis");
            
            // logger.info("Connected to Redis");
        } catch (err) {
            console.log("Could not connect to Redis", err);
            
            // logger.error("Could not connect to Redis", err);
        }
    }
    return client
};
connnectRedis()

module.exports = client;
