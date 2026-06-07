import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory } from '../event.entity';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Название обязательно' })
  @MaxLength(200)
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @MaxLength(300)
  location?: string;

  @IsDateString({}, { message: 'Некорректный формат даты (ISO 8601)' })
  date: string;

  @IsNotEmpty({ message: 'Город обязателен' })
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsEnum(EventCategory, { message: 'Неверная категория' })
  category?: EventCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxParticipants?: number;
}
