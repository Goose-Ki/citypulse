import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Registration } from '../events/registration.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 200 })
  email: string;

  @Column({ nullable: true, type: 'int' })
  age: number | null;

  @Column({ length: 20, default: 'user' })
  role: string;

  @Column({ length: 200, nullable: true, select: false })
  password: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Registration, (reg) => reg.user)
  registrations: Registration[];
}