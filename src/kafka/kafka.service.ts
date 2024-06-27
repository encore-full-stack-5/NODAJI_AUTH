import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { KafkaUserDto } from './dto/KafkaUserDto';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '../users/user.entity';
import { RequestDTO } from 'src/users/dto/RequestDTO.dto';
import { KafkaAccountDto } from './dto/KafkaAccountDto';
import { KafkaEmailDto } from './dto/KafkaEmailDto';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka, 
  ) {}

  async sendUpdateMessage(user: User): Promise<void> {
    const userDto: KafkaUserDto = this.createKafkaUserDto(user);
    const topic = 'user-topic';
    const message = { status: 'update', data: userDto }; 
    await this.clientKafka.emit(topic, message); 
  }

  async sendAccountMessage(user: User): Promise<void> {
    const accountDto: KafkaAccountDto = this.createKafkaAccountDto(user);
    const topic = 'account-topic';
    const message = { status: 'createAccount', data: accountDto }; 
    await this.clientKafka.emit(topic, message); 
  }

  async sendSinupMessge(req: RequestDTO): Promise<void> { 
    const userDto: KafkaUserDto = this.createKafkaUserDto(req); 
    const topic = 'email-topic';
    const message = { status: 'singUp', data: userDto }; 
    await this.clientKafka.emit(topic, message);
  }

  createKafkaEmailDto(user: User): KafkaEmailDto  { 
    return {
      email: user.email
    };
  }

  createKafkaAccountDto(user: User): KafkaAccountDto  { 
    return {
      userId: user.id
    };
  }

  createKafkaUserDto(user: any): KafkaUserDto { 
    return {
      id: user.id,
      email: user.email,
      game: user.game,
      point: user.point,
      rank: user.rank,
      name: user.name
    };
  }

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('account-topic');
    await this.clientKafka.connect();
  }
}
