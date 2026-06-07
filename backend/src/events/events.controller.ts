import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // GET /events?city=Москва&category=concert — публичный
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
  ) {
    return this.eventsService.findAll(city, category);
  }

  // GET /events/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  // POST /events — только admin
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // POST /events/:id/register — зарегистрированный пользователь
  @Post(':id/register')
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  register(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.eventsService.register(eventId, userId);
  }

  // DELETE /events/:id/register — отмена регистрации
  @Delete(':id/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  unregister(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.eventsService.unregister(eventId, userId);
  }
}
