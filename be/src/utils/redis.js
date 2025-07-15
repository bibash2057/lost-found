const redis = require("redis");
const { REDIS } = require("../config/setting");

const client = redis.createClient({
  url: REDIS,
  socket: {
    tls: true,
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("Redis connected"));

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("Redis connected");
})();

module.exports = redisClient;
