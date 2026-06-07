import {
  IsEmail, IsNotEmpty, IsOptional,
  IsInt, Min, Max, MaxLength, IsIn, MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Имя обязательно' })
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(4, { message: 'Пароль минимум 4 символа' })
  password: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt() @Min(1) @Max(120)
  age?: number;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}