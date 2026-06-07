import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Registration } from './registration.entity';

export enum EventCategory {
  CONCERT = 'concert',
  EXHIBITION = 'exhibition',
  SPORT = 'sport',
  THEATRE = 'theatre',
  FESTIVAL = 'festival',
  OTHER = 'other',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 300, nullable: true })
  location: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ length: 100 })
  city: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.OTHER,
  })
  category: EventCategory;

  @Column({ type: 'int', nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  maxParticipants: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Registration, (reg) => reg.event)
  registrations: Registration[];
}
