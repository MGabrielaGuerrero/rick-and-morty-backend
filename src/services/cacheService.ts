import redis from '../config/redis';

/**
 * Servicio genérico de caché usando Redis.
 */
class CacheService {
  /** Obtener un valor del caché */
  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  /** Establecer un valor en el caché con tiempo de expiración (segundos) */
  async set(key: string, value: string, ttl: number): Promise<void> {
    await redis.set(key, value, 'EX', ttl);
  }

  /** Eliminar una clave del caché */
  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}

export default new CacheService();