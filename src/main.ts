import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // 애플리케이션의 루트 모듈을 임포트
import { Transport, MicroserviceOptions } from '@nestjs/microservices'; // 마이크로서비스 관련 타입과 트랜스포트를 임포트

async function bootstrap() { // 애플리케이션 부트스트랩을 위한 비동기 함수 정의
  const app = await NestFactory.create(AppModule); // AppModule을 기반으로 NestJS 애플리케이션 생성

  app.connectMicroservice<MicroserviceOptions>({ // 마이크로서비스를 애플리케이션에 연결
    transport: Transport.KAFKA, // 트랜스포트 타입을 Kafka로 설정
    options: { // Kafka 클라이언트와 소비자 옵션 설정
      client: { // Kafka 클라이언트 설정
        clientId: 'nestjs-client', // 클라이언트 ID 설정
        brokers: ['localhost:9092'], // Kafka 브로커 주소 설정
      },
      consumer: { // Kafka 소비자 설정
        groupId: 'email', // 소비자 그룹 ID 설정
      },
    },
  });

  await app.startAllMicroservices(); // 모든 마이크로서비스를 시작
  await app.listen(3000); // HTTP 서버를 포트 3000에서 시작
}
bootstrap(); // 부트스트랩 함수 실행
