import { Redis } from 'ioredis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Cache, ConfigService, Logger } from '../../shared/abstractions';

@Injectable()
export class RedisCacheImpl implements Cache, OnModuleDestroy {
  private redisClient: Redis;
  private _isRedisAvailable = true;
  private readonly MAX_RETRIES = 5;

  constructor(
    private configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.initializeRedis();
  }

  private async initializeRedis() {
    this.redisClient = new Redis({
      ...this.configService.redis,
      retryStrategy: times => {
        if (times <= this.MAX_RETRIES + 1) {
          // For 6th try
          if (times > this.MAX_RETRIES) {
            this.logger.error('Max retry attempts reached for Redis connection.');

            return null;
          }

          const delay = times;
          this.logger.warn(`Retrying Redis connection in ${delay} seconds. Attempt ${times}`);

          return delay * 1000;
        }

        return null;
      },
    });

    this.redisClient.on('error', async error => {
      this._isRedisAvailable = false;
      this.logger.warn(`Redis connection error: ${error.message}`);
    });

    this.redisClient.on('connect', () => {
      this._isRedisAvailable = true;
      this.logger.info('Redis connected successfully');
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async setData<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this._isRedisAvailable) return false;
    try {
      if (ttl) {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await this.redisClient.set(key, JSON.stringify(value));
      }

      return true;
    } catch (error) {
      this.logger.warn(`Redis set failed for key ${key}: ${error.message}`);

      return false;
    }
  }

  async getData<T>(key: string): Promise<T | null> {
    if (!this._isRedisAvailable) return null;
    try {
      const value = await this.redisClient.get(key);

      return JSON.parse(value || '');
    } catch (error) {
      this.logger.warn(`Redis get failed for key ${key}: ${error.message}`);

      return null;
    }
  }

  async deleteData(key: string): Promise<boolean> {
    if (!this._isRedisAvailable) return false;
    try {
      await this.redisClient.del(key);

      return true;
    } catch (error) {
      this.logger.warn(`Redis del failed for key ${key}: ${error.message}`);

      return false;
    }
  }

  async onModuleDestroy() {
    if (this._isRedisAvailable) {
      try {
        await this.redisClient.quit();
      } catch (error) {
        this.logger.warn(`Redis disconnect failed: ${error.message}`);
      }
    }
  }
}
