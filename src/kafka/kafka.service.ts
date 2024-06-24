import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { KafkaUserDto } from './dto/KafkaUserDto';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '../users/user.entity';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka, // ClientKafka 주입
  ) {}

  async sendMessage(topic: string, message: string): Promise<void> {
    await this.clientKafka.emit(topic, message);
    console.log(`Message sent to ${topic}: ${message}`);
  }

  async sendUpdateMessage(user: User, certification: string): Promise<void> {
    const userDto: KafkaUserDto = this.createKafkaUserDto(user, certification);
    const topic = 'user-update-topic';
    await this.clientKafka.emit(topic, userDto);
    console.log(`User update message sent: ${userDto.email}`);
  }

  createKafkaUserDto(user: User, certification: string): KafkaUserDto {
    return {
      id: user.id,
      email: user.email,
      game: user.game,
      point: user.point,
      rank: user.rank,
      name: user.name,
      certification: certification,
      converter: function (email: string): string[] {
        throw new Error('Function not implemented.');
      },
      converterFromList: function (emails: string[]): string[] {
        throw new Error('Function not implemented.');
      }
    };
  }

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('user-update-topic');
    await this.clientKafka.connect();
  }
}
