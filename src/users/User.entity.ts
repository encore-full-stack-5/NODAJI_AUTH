import { v4 as uuidv4 } from 'uuid';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  rank: number;

  @Column({ nullable: true })
  game: string;

  @Column({ nullable: true })
  point: number;

  @Column({ nullable: true })
  account: number;

  @CreateDateColumn()
  date: Date;

  @Column({ default: false, nullable: true })
  certification: boolean;
}
