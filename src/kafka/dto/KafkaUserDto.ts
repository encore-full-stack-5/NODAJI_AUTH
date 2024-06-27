export class KafkaUserDto {
    constructor(
      public id: string,
      public point: number,
      public name: string,
      public rank: number,
      public game: string,
      public email: string
    ) {}

  }
  