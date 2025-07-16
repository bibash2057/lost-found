const redis = require("redis");
const { REDIS } = require("../config/setting");

const redisClient = redis.createClient({
  // url: REDIS,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connected"));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
