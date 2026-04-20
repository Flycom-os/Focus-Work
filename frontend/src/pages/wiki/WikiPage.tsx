import { useEffect } from 'react'

export function WikiPage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page wiki">
      <div className="page__title">Focus Work Wiki</div>

      <div className="card">
        <div className="card__title">О проекте</div>
        <div className="muted">
          Focus Work — pet‑project с модульной архитектурой: фронт (React + Vite) и бэк (NestJS + Prisma + Postgres).
          Сейчас в проекте есть 3 основных раздела: Tracker, CRM, Miro.
        </div>
      </div>

      <div className="card">
        <div className="card__title">Стек</div>
        <div className="muted">
          <div>
            <strong>Frontend</strong>: React 19, Vite 8, React Router.
          </div>
          <div>
            <strong>Backend</strong>: NestJS 11, Prisma 6, PostgreSQL, JWT auth.
          </div>
          <div>
            <strong>UI/Docs</strong>: Storybook, Vitest + Testing Library.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Навигация (Frontend)</div>
        <div className="muted">
          <div>
            <strong>/tracker</strong> — прототип YouTrack‑подобного трекера: issues, timesheets, профиль.
          </div>
          <div>
            <strong>/crm</strong> — настройки системы/склады/компании/профиль (под JWT).
          </div>
          <div>
            <strong>/miro</strong> — доски и ноды (whiteboard).
          </div>
          <div>
            <strong>/wiki</strong> — эта документация.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Backend модули</div>
        <div className="muted">
          <div>
            <strong>Auth/User</strong>: логин `/auth/login`, текущий пользователь `/user/me`.
          </div>
          <div>
            <strong>Miro</strong>: `/miro/boards`, `/miro/nodes`.
          </div>
          <div>
            <strong>CRM</strong>: `/crm/profile`, `/crm/system`, `/crm/warehouses`, `/crm/companies`.
          </div>
          <div>
            <strong>Tracker</strong>: `/tracker/issues`, `/tracker/timesheet`, `/tracker/profile`, `/tracker/assignees`.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Tracker: как устроено</div>
        <div className="muted">
          <div>
            <strong>Issues</strong>: список + редактор справа. В БД: таблица `TrackerIssue`.
          </div>
          <div>
            <strong>Assignee</strong>: хранится как `assigneeId` (связь с `User`) и отображается как имя.
          </div>
          <div>
            <strong>Timesheets</strong>: часы по дням недели на пользователя. В БД: `TrackerTimeEntry` (уникально по
            `userId+weekTitle+day`).
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Проблемы Prisma на Windows (EPERM / P2021)</div>
        <div className="muted">
          <div>
            <strong>P2021 (table does not exist)</strong>: означает, что в Postgres нет таблицы. Обычно лечится миграцией
            Prisma. В этом проекте добавлен “dev‑fallback”: tracker может создать таблицы сам при первом обращении, если
            миграции не применились.
          </div>
          <div style={{ marginTop: 10 }}>
            <strong>EPERM rename query_engine…dll.node</strong>: Windows держит lock на Prisma engine. Решение:
            остановить все `node.exe`, которые используют Prisma/бэк, удалить `*.tmp*` из `node_modules/.prisma/client`
            и повторить `prisma generate`.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card__title">Как запустить</div>
        <div className="muted">
          <div>
            <strong>Backend</strong>: `npm i` → `npm run start:dev` (порт из конфигов проекта).
          </div>
          <div>
            <strong>Frontend</strong>: `npm i` → `npm run dev` (по умолчанию :3000).
          </div>
          <div>
            <strong>Storybook</strong>: `npm run storybook` (frontend).
          </div>
          <div>
            <strong>Tests</strong>: `npm test` (frontend).
          </div>
        </div>
      </div>
    </div>
  )
}

