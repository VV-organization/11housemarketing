# 11housemarketing

Независимая копия текущего рабочего состояния ElevenHouse от 22 сентября 2026 года,
включая локальные дизайн-материалы и незакоммиченные изменения оригинала.

- Репозиторий: https://github.com/VV-organization/11housemarketing
- Рабочая папка: `/Users/anastasiavolkova/Documents/ChatGPT/11housemarketing`
- Оригинал: `/Users/anastasiavolkova/Documents/ChatGPT/11хаус`

## Локальный запуск

```sh
cd /Users/anastasiavolkova/Documents/ChatGPT/11housemarketing
npm run dev
```

Адрес: http://127.0.0.1:5174. Фиксированный порт позволяет отличать копию от оригинала.
Если порт занят, сервер завершится с ошибкой, не переключаясь на другой адрес.

Для свежего клона сначала выполнить `npm ci`. В локальную копию зависимости уже перенесены.

## Проверки

```sh
npm run build
npm test -- --run
```

## Независимость

У копии собственный Git-репозиторий и единственный remote `origin`, ведущий в
`VV-organization/11housemarketing`. Общих файлов, Git worktree и общей папки
`node_modules` с оригиналом нет. История начинается со снимка текущих файлов.
Исходники интерфейса, стили, Hero и версии зависимостей сохранены.

GitHub Pages автоматически при push не публикуется. Workflow доступен только
для ручного запуска после отдельной настройки Pages. Путь сборки для GitHub Actions:
`/11housemarketing/`.

Правила изменений проекта находятся в `AGENTS.md`.
