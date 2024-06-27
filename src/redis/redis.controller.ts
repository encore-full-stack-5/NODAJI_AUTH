import { Controller, Get, Param } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('get/:key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.getValueByKey(key);
    return { key, value };
  }
}
