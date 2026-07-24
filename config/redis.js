const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

console.log(`Connecting to Redis at: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

const redisUrl = `redis://default:${encodeURIComponent(process.env.REDIS_PASSWORD || '')}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const client = redis.createClient({
    url: redisUrl,
    disableOfflineQueue: true,
    socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.log('Redis max reconnect retries reached. Operating without Redis cache.');
                return false; // stop retrying
            }
            return 1000;
        }
    }
});

client.on('error', (err) => console.log('Redis Client Error:', err.message || err));
client.on('connect', () => console.log('Redis Client Connected'));

const connectRedis = async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Could not connect to Redis:', err.message || err);
    }
};

module.exports = { client, connectRedis };
