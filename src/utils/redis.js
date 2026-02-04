const { createClient } = require("redis");
// const logger = require("./logger");

const client = createClient();

client.on("error", (err) => {
    console.log("Redis Client Error", err);
});

(async () => {
    try {
        await client.connect();
        console.log("Connected to Redis");
        
        // logger.info("Connected to Redis");
    } catch (err) {
        console.log("Could not connect to Redis", err);
        
        // logger.error("Could not connect to Redis", err);
    }
})();

module.exports = client;
