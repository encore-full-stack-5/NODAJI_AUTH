import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [UsersModule, DatabaseModule, JwtModule],
  providers: [AppService],
})
export class AppModule {}
