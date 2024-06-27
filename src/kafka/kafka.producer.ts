import { Kafka } from 'kafkajs'; 
import { KafkaStatus } from './dto/kafka-status.dto';

// Kafka 클라이언트 설정
const produceMessage = async (topic: string, message: any) => { 

  const kafka = new Kafka({
    brokers: ['192.168.0.20:9092'], 
  });

  const producer = kafka.producer();

  await producer.connect(); 

  const kafkaStatus = new KafkaStatus<any>(message, 'status');

  // KafkaStatus 객체 메시지 전송
  await producer.send({
    topic, 
    messages: [{ value: JSON.stringify(kafkaStatus) }] 
  });

  // 프로듀서 연결 해제
  await producer.disconnect(); 
};

export { produceMessage };
