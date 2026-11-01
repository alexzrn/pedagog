# pedagog — учебный центр

Портал учебного центра: каталог программ, страницы программ, запись на программу.
Astro 7, статическая сборка. Деплой: Cloudflare Pages из ветки `main`.
Домен: https://pedagog.beliberde.net (nginx на VPS проксирует на Pages).

## Страницы

| URL | Что это |
| --- | --- |
| `/` | каталог программ (тот же компонент, что `/programs`) |
| `/programs` | каталог программ |
| `/program/<slug>` | страница программы: учебный план, аттестация, формат, запись |
| `/apply` | форма записи |
| `/legal` | документы, оплата, возврат, перенос |
| `/about` | о центре |
| `/program` | редирект на `/program/igrovaya-zavisimost` (`public/_redirects`, 301) |

## Данные программ

`src/data/programs.json` — единственный источник правды. Карточка каталога,
страница программы, список в форме записи и фильтр по направлениям строятся из него.

Чтобы добавить программу, допишите объект в `programs`:

```json
{
  "slug": "novaya-programma",
  "title": "Название",
  "direction": "Направление",
  "summary": "Одно предложение для карточки.",
  "hours": 72,
  "modulesCount": 4,
  "format": "онлайн",
  "nextCohort": "12 января 2027",
  "studyLoad": "4 модуля по 18 часов",
  "price": 19900,
  "priceEarly": 17900,
  "prepay": 5000,
  "document": "Удостоверение о повышении квалификации, 72 часа",
  "status": "Идёт набор",
  "audience": ["..."],
  "notAudience": ["..."],
  "outcomes": ["..."],
  "modules": [{ "n": 1, "theme": "...", "theory": 8, "practice": 10, "result": "...", "attest": "..." }],
  "attestation": { "intro": "...", "items": ["..."], "test": "...", "cases": "..." },
  "faq": [{ "q": "...", "a": "..." }]
}
```

`/program/<slug>` создаётся автоматически (`getStaticPaths`). Поля `audience`,
`notAudience`, `outcomes`, `modules`, `attestation`, `faq` необязательны: без них
секции не рендерятся. Если данных о формате или потоке нет, пишите `"уточняется"`,
на сайте это честная плашка.

## Приём заявок

Форма постит JSON в `POST /api/apply`. Обработчик — `functions/api/apply.js`,
это Cloudflare Pages Function (Astro остаётся статическим). Сейчас обработчик
**заглушка**: валидирует поля и возвращает `{ "ok": true }`, но ничего не сохраняет
и никуда не отправляет. Это помечено комментарием в файле; там же TODO на замену
реальным приёмником (почта или FamilyOS API).

## Локальная проверка

```bash
npm install
npm run dev     # http://localhost:4321, но /api/apply в dev не работает
npm run build   # dist/
```

Для проверки формы нужен сервер, который отдаёт `dist/` и выполняет Pages Functions
(см. `functions/api/apply.js`, экспорт `onRequestPost`). На проде это делает
Cloudflare Pages.

## Сборка и деплой

`npm run build` → `dist/`. Cloudflare Pages собирает ветку `main` автоматически;
`functions/` подхватываются как Pages Functions, `public/_redirects` копируется в
`dist/_redirects`.
