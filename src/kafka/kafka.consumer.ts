import { Kafka } from 'kafkajs';
import { KafkaStatus } from './dto/kafka-status.dto';
import { UsersService } from '../users/users.service'; // Adjust the path as necessary

let usersService: UsersService; // Declare a variable for UsersService

export const setUserService = (service: UsersService) => {
  usersService = service;
};

const kafka = new Kafka({
  brokers: ['192.168.0.20:9092'],
});

const consumer = kafka.consumer({ groupId: 'auth-group' });

const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log({
        partition,
        offset: message.offset,
        value,
      });

      const status: KafkaStatus<any> = JSON.parse(value);
      await listenerKafkaStatus(status); 
    },
  });
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
      console.warn('Unknown status:', status.status);
  }
};

export { consumeMessages, listenerKafkaStatus };