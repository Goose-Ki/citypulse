import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Кастомный декоратор @Roles() — записывает допустимые роли в метаданные маршрута
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
