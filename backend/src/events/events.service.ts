import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Registration } from './registration.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,

    @InjectRepository(Registration)
    private readonly registrationsRepository: Repository<Registration>,

    private readonly usersService: UsersService,
  ) {}

  // GET /events
  async findAll(city?: string, category?: string): Promise<Event[]> {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .loadRelationCountAndMap('event.registrationCount', 'event.registrations')
      .orderBy('event.date', 'ASC');

    if (city) qb.andWhere('LOWER(event.city) = LOWER(:city)', { city });
    if (category) qb.andWhere('event.category = :category', { category });

    return qb.getMany();
  }

  // GET /events/:id
  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['registrations', 'registrations.user'],
    });
    if (!event) throw new NotFoundException(`Событие с id=${id} не найдено`);
    return event;
  }

  // POST /events (только admin)
  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(dto);
    return this.eventsRepository.save(event);
  }

  // POST /events/:id/register — регистрация пользователя на событие
  async register(eventId: string, userId: string): Promise<Registration> {
    const event = await this.findOne(eventId);
    const user = await this.usersService.findOne(userId);

    // Проверка лимита участников
    if (event.maxParticipants) {
      const count = await this.registrationsRepository.count({
        where: { event: { id: eventId } },
      });
      if (count >= event.maxParticipants) {
        throw new BadRequestException('Достигнут лимит участников');
      }
    }

    // Проверка повторной регистрации
    const existing = await this.registrationsRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });
    if (existing) {
      throw new ConflictException('Вы уже зарегистрированы на это событие');
    }

    const reg = this.registrationsRepository.create({ user, event });
    return this.registrationsRepository.save(reg);
  }

  // DELETE /events/:id/register — отмена регистрации
  async unregister(eventId: string, userId: string): Promise<void> {
    const reg = await this.registrationsRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });
    if (!reg) throw new NotFoundException('Регистрация не найдена');
    await this.registrationsRepository.remove(reg);
  }
}
