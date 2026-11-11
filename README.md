# Focus Work

Pet‑project: **Frontend (React/Vite)** + **Next.js & Storybook (frontend-next)** + **Backend (NestJS/Prisma/Postgres)**.

## Что внутри

- **Tracker**: issues + timesheets + профиль (YouTrack‑like прототип)
- **CRM**: настройки системы, склады, компании, профиль
- **Miro**: whiteboard (доски/ноды)
- **Storybook & Next.js**: `frontend-next` с интерактивной галереей всех иконок JetBrains (770) и Lucide (2,052)
- **UI Kit**: библиотека UI компонентов + unit‑тесты

## Быстрый старт

### Backend

```bash
cd backend
npm i
npm run start:dev
```

### Next.js & Storybook (Icon Catalog)

```bash
cd frontend-next
npm run storybook    # Запуск Storybook на http://localhost:6006
# или
npm run dev          # Запуск Next.js на http://localhost:3000
```

### Frontend (Vite)

```bash
cd frontend
npm i
npm run dev
```

## Документация (Wiki)

Открой страницу `/wiki` в приложении — там собрана подробная документация по модулям, API и типичным проблемам.
