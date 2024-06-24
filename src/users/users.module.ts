import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { KafkaModule } from '../kafka/kafka.module'; // KafkaModule 임포트

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    forwardRef(() => KafkaModule), // KafkaModule을 forwardRef로 가져옴
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
