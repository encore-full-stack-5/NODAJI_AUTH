import { Kafka } from 'kafkajs'; // kafkajs 라이브러리에서 Kafka를 임포트
import { KafkaStatus } from './dto/kafka-status.dto'; // KafkaStatus 임포트

const kafka = new Kafka({
  clientId: 'nodaji', // Kafka 클라이언트 ID 설정
  brokers: ['localhost:9092'], // Kafka 브로커 주소 설정
});

const consumer = kafka.consumer({ groupId: 'email' }); // Kafka 소비자 생성, 그룹 ID 설정

const consumeMessages = async (topic: string) => { // 메시지를 Kafka에서 소비하는 비동기 함수 정의
  await consumer.connect(); // 소비자 연결
  await consumer.subscribe({ topic, fromBeginning: true }); // 토픽 구독 및 처음부터 메시지 소비

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => { // 각 메시지에 대해 실행되는 함수 정의
      const value = message.value.toString();
      console.log({
        partition, // 메시지의 파티션 정보
        offset: message.offset, // 메시지의 오프셋 정보
        value, // 메시지 값 (문자열로 변환)
      });

      // KafkaStatus 객체로 변환 (가정: 메시지 값이 JSON 문자열로 KafkaStatus 객체 포함)
      const status: KafkaStatus<any> = JSON.parse(value);

      // KafkaStatus에 따라 반응하는 함수 호출
      processKafkaStatus(status);
    },
  });
};

const processKafkaStatus = (status: KafkaStatus<any>) => { // KafkaStatus에 따라 반응하는 함수 정의
  switch (status.status) {
    case 'certification':
       const certification = status.data.certification
       const email =status.data.email
       
      console.log("certification");
      break;
    case 'updatePoint':
      
      break;
   
    default:
      console.warn('Unknown status:', status.status);
      // 기타 상태 처리 로직 추가
  }
};

export { consumeMessages, processKafkaStatus }; // consumeMessages와 processKafkaStatus 함수를 내보내기
