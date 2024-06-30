import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/User.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'auth-mysql-auth',  // Updated to use the correct service name
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'nodagi_auth',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
