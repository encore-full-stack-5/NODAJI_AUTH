import { Kafka } from 'kafkajs';
import { KafkaStatus } from './dto/kafka-status.dto';
import { UsersService } from '../users/users.service';

let usersService: UsersService;

export const setUserService = (service: UsersService) => {
  usersService = service;
};

const kafka = new Kafka({
    clientId: 'nestjs-consumer-server',
  brokers: ['35.184.196.158:9094'],
});

const consumer = kafka.consumer({ groupId: 'auth-group' });

const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run();
};

const listenerKafkaStatus = async (status: KafkaStatus<any>) => {
  switch (status.status) {
    case 'point':
      const userId = status.data.id;
      const point = status.data.point;

      try {
        const user = await usersService.updateUserPoints(userId, point);
      } catch (error) {
        console.error(`Error ${userId}:`, error);
      }
      break;

    default:
  }
};

export { consumeMessages, listenerKafkaStatus };