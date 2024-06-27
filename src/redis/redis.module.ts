import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { RedisModule as NestRedisModule} from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    NestRedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  controllers: [RedisController],
  exports: [RedisService],
})
export class RedisModule {}
