import Redis from 'ioredis';
import 'dotenv/config';

// Configuración de Redis desde variables de entorno

const redis = new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASS ?? undefined,
});
  

redis.ping()
  .then(() => {
    console.log('Redis connected successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to Redis:', error);
  });

export default redis;