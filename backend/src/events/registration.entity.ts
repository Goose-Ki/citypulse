import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from './event.entity';

@Entity('registrations')
@Unique(['user', 'event']) // Один пользователь — одна регистрация на событие
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (event) => event.registrations, { onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  registeredAt: Date;
}
