export class KafkaStatus<T> {
    constructor(
      public data: T,
      public status: string
    ) {}
  }