export class KafkaUserDto {
    certification: any;
    constructor(
      public id: string,
      public point: number,
      public name: string,
      public rank: number,
      public game: string,
      public email: string
      

    ) {}
  
    public converter(email: string): string[] {
      return [email];
    }
  
    public converterFromList(emails: string[]): string[] {
      return emails;
    }
  }
  