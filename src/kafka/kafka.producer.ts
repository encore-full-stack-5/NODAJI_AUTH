import { Kafka } from 'kafkajs'; // kafkajs 라이브러리에서 Kafka를 임포트import { KafkaUserDto } from './dto/KafkaUserDto'; // KafkaUserDto 임포트
import { KafkaUserDto } from './dto/KafkaUserDto';

const kafka = new Kafka({
  clientId: 'nodaji', // Kafka 클라이언트 ID 설정
  brokers: ['localhost:9092'], // Kafka 브로커 주소 설정
});

const producer = kafka.producer(); // Kafka 프로듀서 생성

const produceMessage = async (topic: string, message: KafkaUserDto) => { // 메시지를 Kafka에 전송하는 비동기 함수 정의
  await producer.connect(); // 프로듀서 연결
  await producer.send({
    topic, // 메시지를 보낼 Kafka 토픽 이름
    messages: [{ value: JSON.stringify(message) }], // 보낼 메시지 값 설정 (JSON 문자열로 변환)
  });
  await producer.disconnect(); // 프로듀서 연결 해제
};

export { produceMessage }; // produceMessage 함수를 내보내기