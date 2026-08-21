# Bookmark manager - Backend API

RESTful API сервис для управления пользовательскими закладками, категориями и
тегами. Построен на Node.js, Express, TypeScript и Mongoose ORM.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?logo=mongoose)](https://mongoosejs.com/)

---

## Связанные репозитории и демо

- **Frontend:**
  [Ссылка на репозиторий](https://github.com/Krealf/bookmark-manager-fe)
- **Live Demo:** [](<>)

---

## Архитектура и стек технологий

- **Runtime:** Node.js (TypeScript)
- **Фреймворк:** Express.js
- **База данных и ORM:** MongoDB + Mongoose ORM
- **Аутентификация:** JWT (Access / Refresh токены) + bcryptjs
- **Валидация:** Zod

---

## Основной функционал

- Регистрация и аутентификация пользователей (JWT).
- CRUD операции с закладками (добавление, редактирование, удаление).
- Группировка по категориям и назначение тегов.
- Полнотекстовый поиск и фильтрация по статусам/тегам.
- Парсинг метаданных URL (title, description, favicon, image).

---

## Быстрый старт

### Требования

- Node.js >= 20.x
- MongoDB >= 8.x
- npm / yarn / pnpm

### Вариант 1. Полноценный запуск (Backend + DB + Frontend)

Для полноценного запуска вместе с MongoDB и фронтендом используйте главный репозиторий [bookmark-manager-infra](https://github.com/krealf/bookmark-manager-infra).

### Вариант 2: Быстрый запуск через Docker

Для запуска API вместе с изолированной базой данных MongoDB не требуется
локальная установка Node.js или СУБД — достаточно установленного Docker Desktop.

1. Клонируйте репозиторий:

```bash
git clone https://github.com/Krealf/bookmark-manager-be.git
cd bookmark-manager-be
```

2. Запустите стек в фоновом режиме:

```bash
docker compose up -d --build
```

3. Проверьте статус работы контейнеров:

```bash
docker compose ps
```

4. Просмотр логов сервера в реальном времени:

```bash
docker compose logs -f bookmark-backend
```

API будет доступно по адресу `http://localhost:5000`, а порт MongoDB `27017`
проброшен на хост для подключения через GUI-клиенты (MongoDB Compass).

Остановка сервисов:

```bash
docker compose down
```

---

### Вариант 3: Локальная разработка (Manual)

1. Клонируйте репозиторий:

```bash
git clone https://github.com/Krealf/bookmark-manager-be.git
cd bookmark-manager-be
```

2. Установите зависимости:

```bash
npm install
```

3. Настройте файл переменных окружения:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# Настройка DB
MONGO_USER=master
MONGO_PASSWORD=master123
MONGO_DB_NAME=bookmark
MONGODB_PORT=27017

# Настройка Backend
PORT=5000
JWT_ACCESS_SECRET=7e689509d0e63161a6c71f1ebed14ea33b6dd205305a3eaaadb3fe48e01b06af8b0549e13ad702239b5c168721e760104fc66b49cf16bee4974916efdd9bc6a0
JWT_REFRESH_SECRET=7e689509d0e63161a6c71f1ebed14ea33b6dd205305a3eaaadb3fe48e01b06af8b0549e13ad702239b5c168721e760104fc66b49cf16bee4974916efdd9bc6a0
CORS_ORIGIN=http://localhost:3000
```

4. Запустите сервер в режиме разработки:

```bash
npm run dev
```

Сервер будет доступен по адресу `http://localhost:3001`.

---

## Сборка и запуск production:

```bash
npm run build
npm start
```



## Основные эндпоинты API

| Метод    | Эндпоинт             | Описание                                      | Доступ  |
| :------- | :------------------- | :-------------------------------------------- | :------ |
| `POST`   | `/auth/register`     | Регистрация нового пользователя               | Public  |
| `POST`   | `/auth/login`        | Вход и получение токенов                      | Public  |
| `GET`    | `/api/bookmarks`     | Список закладок                               | Private |
| `POST`   | `/api/bookmarks`     | Создание новой закладки (автосбор метаданных) | Private |
| `PUT`    | `/api/bookmarks/:id` | Обновление закладки                           | Private |
| `DELETE` | `/api/bookmarks/:id` | Удаление закладки                             | Private |
| `PATCH`  | `/api/bookmarks/:id` | Изменение закладки                            | Private |
