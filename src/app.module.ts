import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';


@Module({
  imports: [UsersModule, KafkaModule, DatabaseModule, JwtModule, RedisModule], 
  providers: [AppService],
})
export class AppModule {}
