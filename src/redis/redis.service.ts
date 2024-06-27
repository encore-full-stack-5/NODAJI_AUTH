import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {} 

  async getValueByKey(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
}
