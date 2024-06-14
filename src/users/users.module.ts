import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User.entity';
import { JwtCustomModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtCustomModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
