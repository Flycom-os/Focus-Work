// Navigation structure for the documentation portal
window.DOCS_NAVIGATION = [
  {
    title: "Главная",
    items: [
      { name: "Оглавление", path: "index.html", id: "main-index" }
    ]
  },
  {
    title: "Модуль Задач (YouTrack)",
    items: [
      { name: "Введение и Архитектура", path: "tasks/index.html", id: "tasks-index" },
      { name: "Разбор исходного кода", path: "tasks/code.html", id: "tasks-code" },
      { name: "Фичи и Практические гайды", path: "tasks/features.html", id: "tasks-features" }
    ]
  },
  {
    title: "Модуль Whiteboard (Miro)",
    items: [
      { name: "Введение и Архитектура", path: "whiteboard/index.html", id: "whiteboard-index" },
      { name: "Разбор исходного кода", path: "whiteboard/code.html", id: "whiteboard-code" },
      { name: "Фичи и Практические гайды", path: "whiteboard/features.html", id: "whiteboard-features" }
    ]
  },
  {
    title: "Модуль CRM (Бизнес-центр)",
    items: [
      { name: "Введение и Архитектура", path: "crm/index.html", id: "crm-index" },
      { name: "Разбор исходного кода", path: "crm/code.html", id: "crm-code" },
      { name: "Фичи и Практические гайды", path: "crm/features.html", id: "crm-features" }
    ]
  }
];

// Search database containing index of headers across all pages for fast client-side searching.
window.DOCS_SEARCH_INDEX = [
  // MAIN HUB
  { title: "Оглавление документации", url: "index.html", description: "Главная страница технической документации по Next.js приложению. Модули: Задачи, Whiteboard, CRM.", tags: ["главная", "документация", "nextjs"] },
  
  // TASKS MODULE
  { title: "Модуль Задач: Введение и общие сведения", url: "tasks/index.html#intro", description: "Обзор модуля задач (аналога YouTrack), его назначения и интеграции в экосистему Focus-Work.", tags: ["задачи", "tasks", "youtrack", "архитектура"] },
  { title: "Модуль Задач: Архитектура и Data Flow", url: "tasks/index.html#architecture", description: "Архитектурная схема модуля задач, потоки данных от клиента к серверу, WebSocket события.", tags: ["архитектура", "mermaid", "dataflow", "websocket"] },
  { title: "Модуль Задач: Prisma Модели и Схема БД", url: "tasks/index.html#database", description: "Детальный разбор таблиц Task, Column, Board, Project, Comment и их отношений в PostgreSQL.", tags: ["prisma", "база данных", "postgres", "модели"] },
  { title: "Модуль Задач: Разбор ключевых файлов", url: "tasks/code.html", description: "Построчный разбор серверных экшенов, кастомных хуков React Query и Kanban-доски.", tags: ["код", "page.tsx", "actions", "hooks", "kanban"] },
  { title: "Модуль Задач: Kanban-доска и Drag and Drop", url: "tasks/code.html#kanban-component", description: "Полноразмерный разбор KanbanBoard.tsx с использованием @hello-pangea/dnd.", tags: ["kanban", "drag-and-drop", "dnd", "react"] },
  { title: "Модуль Задач: Серверные экшены (Actions)", url: "tasks/code.html#server-actions", description: "Детальный разбор server actions для создания, перемещения и обновления статуса задач.", tags: ["actions", "server-actions", "crud", "nextjs"] },
  { title: "Модуль Задач: Фичи и возможности", url: "tasks/features.html#features", description: "Управление статусами, тегами, оценками времени (estimation) и спринтами.", tags: ["спринты", "теги", "время", "фильтры", "фичи"] },
  { title: "Модуль Задач: Практические гайды (How-to)", url: "tasks/features.html#guides", description: "Инструкции по добавлению новых статусов, кастомных полей и интеграции с CRM.", tags: ["интеграция", "гайды", "расширение", "инструкция"] },
  
  // WHITEBOARD MODULE
  { title: "Модуль Whiteboard: Введение и Интерактивность", url: "whiteboard/index.html#intro", description: "Обзор виртуальной доски для совместной работы в реальном времени (аналог Miro / tldraw).", tags: ["whiteboard", "миро", "tldraw", "canvas"] },
  { title: "Модуль Whiteboard: Архитектура Canvas и WebSockets", url: "whiteboard/index.html#architecture", description: "Архитектурная схема с использованием HTML5 Canvas / SVG и WebSocket сервера для трансляции курсоров.", tags: ["архитектура", "canvas", "websockets", "collaborative"] },
  { title: "Модуль Whiteboard: Prisma Модели и Состояние доски", url: "whiteboard/index.html#database", description: "Схема данных Prisma для хранения фигур, стрелок, стикеров и логов изменений.", tags: ["prisma", "фигуры", "shapes", "postgres"] },
  { title: "Модуль Whiteboard: Разбор ключевых файлов", url: "whiteboard/code.html", description: "Построчный разбор бесконечного холста Canvas.tsx и хука useWhiteboardSocket.", tags: ["код", "canvas", "hooks", "websockets"] },
  { title: "Модуль Whiteboard: Бесконечный холст Canvas.tsx", url: "whiteboard/code.html#canvas-component", description: "Детальный разбор логики рендеринга, масштабирования (zoom) и панорамирования (pan).", tags: ["zoom", "pan", "canvas", "render"] },
  { title: "Модуль Whiteboard: WebSocket синхронизация", url: "whiteboard/code.html#socket-hook", description: "Хук useWhiteboardSocket для трансляции перемещения фигур и курсоров других пользователей.", tags: ["sockets", "yjs", "webrtc", "realtime"] },
  { title: "Модуль Whiteboard: Фигуры, стикеры и экспорт", url: "whiteboard/features.html#features", description: "Инструменты рисования, стикеры, соединительные линии и экспорт в PNG/SVG.", tags: ["png", "svg", "экспорт", "стикеры", "фигуры"] },
  { title: "Модуль Whiteboard: Практические гайды", url: "whiteboard/features.html#guides", description: "Как добавить новый инструмент (рисунок), оптимизировать рендеринг 10к фигур.", tags: ["оптимизация", "гайды", "новыефигуры"] },

  // CRM MODULE
  { title: "Модуль CRM: Введение и возможности", url: "crm/index.html#intro", description: "Обзор CRM-системы: управление клиентами, воронками продаж, складом и камерами.", tags: ["crm", "клиенты", "сделки", "склад", "камеры", "аналитика"] },
  { title: "Модуль CRM: Архитектура и Интеграция с Камерами", url: "crm/index.html#architecture", description: "Схема архитектуры CRM, интеграция с RTSP-стримингом видеокамер и детекцией лиц.", tags: ["архитектура", "rtsp", "видео", "стриминг", "аналитика"] },
  { title: "Модуль CRM: Prisma Схема и Отношения", url: "crm/index.html#database", description: "Обширная схема Prisma: Deal, Customer, Product, Warehouse, Camera, Transaction.", tags: ["prisma", "сделки", "склады", "транзакции"] },
  { title: "Модуль CRM: Разбор кода и Воронка Сделок", url: "crm/code.html", description: "Анализ DealPipeline.tsx, видеоплеера RTSP/HLS и аналитических дашбордов.", tags: ["код", "deals", "pipeline", "hls", "charts"] },
  { title: "Модуль CRM: RTSP Видеоплеер и Стриминг", url: "crm/code.html#camera-player", description: "Компонент CameraPlayer.tsx с интеграцией HLS.js для просмотра камер наблюдения в реальном времени.", tags: ["hls.js", "видеокамеры", "rtsp", "стриминг"] },
  { title: "Модуль CRM: Фичи, Аналитика и Склады", url: "crm/features.html#features", description: "Дашборд аналитики с Recharts, интеграция с 1С, партионный учет на складах.", tags: ["recharts", "склад", "1с", "аналитика"] },
  { title: "Модуль CRM: Практические гайды", url: "crm/features.html#guides", description: "Как подключить новую камеру к CRM, добавить этап в воронку продаж, настроить вебхук.", tags: ["камера", "воронка", "вебхуки", "инструкция"] }
];
