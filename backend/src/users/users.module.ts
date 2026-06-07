import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Регистрация репозитория в модуле
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Экспорт для использования в EventsModule
})
export class UsersModule {}
