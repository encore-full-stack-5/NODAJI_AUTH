import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { UsersModule } from '../users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { consumeMessages, setUserService } from './kafka.consumer';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    forwardRef(() => UsersModule), 
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['192.168.0.20:9092'],
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    setUserService(this.usersService); 
    await consumeMessages('account-topic');
  }
}
