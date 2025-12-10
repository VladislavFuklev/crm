# Инструкция по настройке и запуску Mini CRM

## Быстрый старт для тестирования (без БД)

Если вы хотите просто посмотреть интерфейс без базы данных:

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Приложение запустится, но API запросы будут ошибаться без БД.

## Полная настройка с PostgreSQL

### Вариант 1: Локальная PostgreSQL

1. **Установите PostgreSQL** (если еще не установлен):

   ```bash
   # macOS с Homebrew
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Создайте базу данных**:

   ```bash
   psql postgres
   CREATE DATABASE crm_db;
   \q
   ```

3. **Настройте .env**:

   ```bash
   # Скопируйте пример
   cp .env.example .env

   # Отредактируйте .env и замените на свои данные:
   DATABASE_URL="postgresql://ВАШ_ЮЗЕР:ВАШ_ПАРОЛЬ@localhost:5432/crm_db?schema=public"
   ```

4. **Создайте таблицы**:

   ```bash
   npx prisma db push
   ```

5. **Запустите приложение**:
   ```bash
   npm run dev
   ```

### Вариант 2: Neon (бесплатная облачная PostgreSQL)

1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте новый проект
3. Скопируйте Connection String
4. Создайте `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/neondb?sslmode=require"
   ```
5. Выполните:
   ```bash
   npx prisma db push
   npm run dev
   ```

### Вариант 3: Supabase (бесплатная облачная PostgreSQL)

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В Settings → Database найдите Connection String (используйте Direct connection)
4. Создайте `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
   ```
5. Выполните:
   ```bash
   npx prisma db push
   npm run dev
   ```

## Тестирование приложения

После запуска откройте http://localhost:3000

1. **Добавьте первый товар**: нажмите "Добавить товар"
2. **Заполните форму**:
   - Название: iPhone 15 Pro
   - Себестоимость: 30000
   - Статус: В наличии
3. **Отметьте как проданный**:
   - Нажмите Edit (карандаш)
   - Статус: Продано
   - Цена продажи: 35000
   - Дата продажи: сегодняшняя
4. Добавьте еще несколько товаров для тестирования графиков

## Деплой на Vercel

### С Vercel Postgres

1. **Пушим в GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/crm.git
   git push -u origin main
   ```

2. **Деплой на Vercel**:

   - Зайдите на vercel.com
   - Import проект из GitHub
   - Deploy

3. **Создайте Vercel Postgres**:

   - В проекте → Storage → Create Database
   - Выберите Postgres
   - Connect to Project
   - Vercel автоматически добавит DATABASE_URL в Environment Variables

4. **Создайте таблицы**:

   ```bash
   # Локально с DATABASE_URL из Vercel
   npx prisma db push
   ```

5. **Redeploy**: Vercel автоматически задеплоит после push в GitHub

### С внешней БД (Neon/Supabase)

1. Создайте БД на Neon/Supabase
2. В Vercel → Settings → Environment Variables добавьте:
   - `DATABASE_URL` = ваш connection string
3. Redeploy проекта
4. Выполните `npx prisma db push` локально с DATABASE_URL из Vercel

## Полезные команды

```bash
# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Пересоздать клиент Prisma после изменения схемы
npx prisma generate

# Сбросить БД (удалит все данные!)
npx prisma db push --force-reset

# Проверка типов TypeScript
npm run build
```

## Troubleshooting

### Ошибка "Can't reach database server"

- Проверьте правильность DATABASE_URL в .env
- Убедитесь, что PostgreSQL запущен (для локальной БД)
- Проверьте доступ к интернету (для облачных БД)

### Ошибка при prisma db push

- Убедитесь, что БД создана и доступна
- Проверьте права пользователя БД
- Попробуйте `npx prisma db push --force-reset`

### Приложение не показывает данные

- Откройте Developer Tools → Network
- Проверьте ошибки в консоли
- Убедитесь, что API routes отвечают 200
- Проверьте что .env файл в корне проекта

### Графики не отображаются

- Добавьте хотя бы 1 проданный товар с датой продажи
- Перезагрузите страницу
