# CityPulse — Городской агрегатор событий

Клиент-серверное приложение: городская афиша с управлением доступом по ролям.

## Стек

| Слой | Технологии |
|------|-----------|
| Бэкенд | NestJS, TypeScript, TypeORM |
| База данных | PostgreSQL 16 |
| Фронтенд | HTML, CSS, Vanilla JS (ES Modules) |
| Хранение сессии | LocalStorage |
| Контейнеризация | Docker, docker-compose |
| Контроль версий | Git |

## Быстрый запуск

### 1. Запустить базу данных

```bash
docker-compose up -d
```

PostgreSQL доступен на `localhost:5432`  
pgAdmin (веб-интерфейс БД): http://localhost:5050  
Логин pgAdmin: `admin@admin.com` / `admin`

### 2. Настроить бэкенд

```bash
cd backend
cp .env.example .env   # скопировать конфигурацию
npm install
npm run start:dev      # запуск в режиме разработки
```

Сервер: http://localhost:3000

### 3. Запустить фронтенд

```bash
cd frontend
npx serve .            # или любой статический HTTP-сервер
# python3 -m http.server 8080
```

Фронтенд: http://localhost:8080

---

## API Endpoints

### Пользователи
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | /users | все | Список пользователей |
| GET | /users/:id | все | Пользователь по ID |
| POST | /users | admin | Создать пользователя |

### События
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | /events | все | Список событий (фильтр: city, category) |
| GET | /events/:id | все | Событие по ID |
| POST | /events | admin | Создать событие |
| POST | /events/:id/register | user, admin | Записаться на событие |
| DELETE | /events/:id/register | user, admin | Отменить регистрацию |

### Заголовки авторизации
```
x-role: admin      # для защищённых маршрутов
x-user-id: <uuid>  # для маршрутов регистрации на событие
```

---

## Структура проекта

```
city-events/
├── backend/
│   └── src/
│       ├── users/          # Модуль пользователей
│       │   ├── user.entity.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── users.module.ts
│       │   └── dto/create-user.dto.ts
│       ├── events/         # Модуль событий
│       │   ├── event.entity.ts
│       │   ├── registration.entity.ts
│       │   ├── events.controller.ts
│       │   ├── events.service.ts
│       │   ├── events.module.ts
│       │   └── dto/create-event.dto.ts
│       ├── auth/           # Авторизация
│       │   ├── roles.guard.ts
│       │   └── roles.decorator.ts
│       ├── app.module.ts
│       └── main.ts
├── frontend/
│   ├── index.html          # Публичная афиша
│   ├── login.html          # Вход / регистрация
│   ├── admin.html          # Панель администратора
│   ├── css/style.css
│   └── js/
│       ├── api.js          # HTTP-клиент (fetch)
│       └── auth.js         # Управление сессией (LocalStorage)
└── docker-compose.yml
```

## Создание первого администратора

После первого запуска создайте пользователя через API:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "x-role: admin" \
  -d '{"name":"Администратор","email":"admin@city.ru","role":"admin"}'
```

Войдите на http://localhost:8080/login.html с email `admin@city.ru`.

## Схема базы данных

- **users** — пользователи (id, name, email, age, role, createdAt)
- **events** — события (id, title, description, location, date, city, category, price, maxParticipants, createdAt)
- **registrations** — связь пользователь↔событие (id, userId, eventId, registeredAt)
