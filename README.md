# TS Playwright Playground

Mobile-first учебный сайт по TypeScript для QA с упором на Playwright.

## Что внутри
- короткие уроки по TypeScript;
- различия с C#, Java, JavaScript;
- упражнения с показом ответов;
- Playwright-focused блоки;
- прогресс в localStorage.

## Команды

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Деплой на GitHub Pages

Vite base уже настроен под репозиторий:

```ts
base: '/TSPlaywrightPlayground/'
```

Если Pages будет публиковать ветку со статикой, можно сделать так:
1. `npm install`
2. `npm run build`
3. опубликовать содержимое `dist/`

Либо настроить GitHub Actions позже.
