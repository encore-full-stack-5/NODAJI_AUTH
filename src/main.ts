import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kafka 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['35.184.196.158:9094'],
      },
      consumer: {
        groupId: 'email',
      },
    },
  });

  // Redis 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'auth-redis', 
      port: 6379,
    },
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  await app.startAllMicroservices();
  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();
