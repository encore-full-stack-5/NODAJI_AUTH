import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { UsersModule } from '../users/users.module'; // UsersModule 임포트

@Module({
  imports: [
    forwardRef(() => UsersModule), // UsersModule을 forwardRef로 가져옴
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,//
        options: {
          client: {
            clientId: 'nodaji',
            brokers: ['192.168.0.20:9092'],
          },
          consumer: {
            groupId: 'email-group',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
