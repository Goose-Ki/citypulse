import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { Registration } from './registration.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Registration]),
    UsersModule, // импортируем для использования UsersService
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
