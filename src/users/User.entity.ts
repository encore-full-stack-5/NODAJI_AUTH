import { v4 as uuidv4 } from 'uuid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  point: number;

  @Column({ nullable: true })
  account: number;

  @CreateDateColumn()
  date: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}
