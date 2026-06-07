import {
  Injectable, NotFoundException,
  ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Пользователь с id=${id} не найден`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException(`Email ${dto.email} уже зарегистрирован`);

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password: hashed });
    const saved = await this.usersRepository.save(user);
    delete saved.password;
    return saved;
  }

  async login(dto: LoginDto): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const valid = await bcrypt.compare(dto.password, user.password || '');
    if (!valid) throw new UnauthorizedException('Неверный пароль');

    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}