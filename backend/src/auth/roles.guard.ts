import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем список допустимых ролей из метаданных маршрута
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если @Roles() не указан — маршрут публичный
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Роль передаётся в заголовке x-role (в реальном проекте — JWT)
    const role = request.headers['x-role'];

    if (!role) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Доступ запрещён. Требуется роль: ${requiredRoles.join(' или ')}`,
      );
    }

    return true;
  }
}
