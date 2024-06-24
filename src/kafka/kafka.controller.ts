import { Controller, Get, Post, Body } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaStatus } from './dto/kafka-status.dto'; // KafkaStatus import

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('produce')
  async produce(@Body() body: { message: string }) {
    await this.kafkaService.sendMessage('email-topic', body.message);
    return new KafkaStatus('Message sent', 'success'); // Return KafkaStatus object
  }

  @Get('consume')
  consume() {
    return new KafkaStatus('Consuming messages', 'success'); // Return KafkaStatus object
  }
}
