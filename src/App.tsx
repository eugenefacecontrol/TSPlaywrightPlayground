import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Lesson = {
  id: string
  title: string
  minutes: string
  category: 'core' | 'playwright' | 'practice'
  summary: string
  compare?: string
  example?: string
  practice?: string
  answer?: string
  bullets?: string[]
}

const lessons: Lesson[] = [
  {
    id: 'basic-types',
    title: '01. Базовые типы',
    minutes: '5 мин',
    category: 'core',
    summary: 'string, number, boolean, arrays, object types. Это фундамент всего остального.',
    compare:
      'После C#/Java тут важный нюанс: number один и для int, и для double. TS типизирует поверх JS, а не заменяет его.',
    example: `const suiteName: string = 'checkout';\nconst testCount: number = 12;\nconst stable: boolean = true;\nconst tags: string[] = ['smoke', 'ui'];`,
    practice: `const env: _____ = 'stage';\nconst retries: _____ = 2;\nconst headless: _____ = true;`,
    answer: `const env: string = 'stage';\nconst retries: number = 2;\nconst headless: boolean = true;`,
  },
  {
    id: 'unions',
    title: '02. Union + literal types',
    minutes: '6 мин',
    category: 'core',
    summary: 'Одна из главных фишек TS: значение может быть одним из нескольких типов или конкретных значений.',
    compare:
      'В Java/C# такое обычно тяжелее и требует обёрток или иерархий. В TS union — нативный и очень удобный инструмент.',
    example: `let testId: string | number;\n\ntype Status = 'passed' | 'failed' | 'skipped';\nconst status: Status = 'passed';`,
    practice: `type BrowserName = _____;\nconst browser: BrowserName = 'chromium';`,
    answer: `type BrowserName = 'chromium' | 'firefox' | 'webkit';`,
  },
  {
    id: 'objects',
    title: '03. Objects, optional, readonly',
    minutes: '6 мин',
    category: 'core',
    summary: 'type/interface, optional поля, readonly и структурная типизация.',
    compare:
      'TS смотрит на форму объекта, а не только на имя класса. Это очень отличается от более номинального мышления из Java.',
    example: `type LoginData = {\n  email: string;\n  password: string;\n  rememberMe?: boolean;\n};\n\ntype TestCase = {\n  readonly id: string;\n  title: string;\n};`,
    practice: `type TestUser = {\n  id: number;\n  email: string;\n  role?: _____;\n};`,
    answer: `type TestUser = {\n  id: number;\n  email: string;\n  role?: 'admin' | 'manager' | 'viewer';\n};`,
  },
  {
    id: 'functions',
    title: '04. Functions и callbacks',
    minutes: '5 мин',
    category: 'core',
    summary: 'Аргументы, return types, optional params, rest, callbacks.',
    example: `function formatResult(title: string, passed: boolean): string {\n  return passed ? \`${'${title}'}: OK\` : \`${'${title}'}: FAIL\`;\n}\n\nconst log = (message: string): void => {\n  console.log(message);\n};`,
    practice: `function withScreenshot(action: _____): void {\n  action();\n}`,
    answer: `function withScreenshot(action: () => void): void {\n  action();\n}`,
  },
  {
    id: 'generics',
    title: '05. Generics без боли',
    minutes: '7 мин',
    category: 'core',
    summary: 'Как не скатиться в any и сохранить тип при reusable helper functions.',
    compare:
      'Если в C#/Java generic выглядит знакомо, то в TS он часто используется для helper functions, API wrappers и test data.',
    example: `function firstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\ntype ApiResponse<T> = {\n  data: T;\n  success: boolean;\n};`,
    practice: `function identity<_____>(value: _____): _____ {\n  return value;\n}`,
    answer: `function identity<T>(value: T): T {\n  return value;\n}`,
  },
  {
    id: 'narrowing',
    title: '06. unknown, narrowing, guards',
    minutes: '7 мин',
    category: 'core',
    summary: 'Ключевой практический блок для API, JSON и внешних данных.',
    compare:
      '`unknown` почти всегда лучше `any`, если данные пришли извне. Сначала проверяешь, потом используешь.',
    example: `function printValue(value: string | number) {\n  if (typeof value === 'string') {\n    console.log(value.toUpperCase());\n  } else {\n    console.log(value.toFixed(2));\n  }\n}`,
    practice: `function logUnknown(data: _____): void {\n  if (typeof data === 'string') {\n    console.log(data.trim());\n  }\n}`,
    answer: `function logUnknown(data: unknown): void {\n  if (typeof data === 'string') {\n    console.log(data.trim());\n  }\n}`,
  },
  {
    id: 'utility-types',
    title: '07. Utility types',
    minutes: '5 мин',
    category: 'core',
    summary: 'Partial, Pick, Omit, Record — суперполезная повседневная штука.',
    example: `type User = {\n  id: number;\n  email: string;\n  role: string;\n};\n\ntype CreateUser = Omit<User, 'id'>;\ntype UserPatch = Partial<User>;`,
    practice: `type Browser = 'chromium' | 'firefox' | 'webkit';\n\nconst timeouts: _____ = {\n  chromium: 3000,\n  firefox: 5000,\n  webkit: 4000,\n};`,
    answer: `const timeouts: Record<Browser, number> = {\n  chromium: 3000,\n  firefox: 5000,\n  webkit: 4000,\n};`,
  },
  {
    id: 'playwright-basics',
    title: '10. Playwright basics',
    minutes: '8 мин',
    category: 'playwright',
    summary: 'Page, Locator, typed helper functions, typed test data.',
    example: `import { test, expect, Page, Locator } from '@playwright/test';\n\ntest('login button is visible', async ({ page }) => {\n  await page.goto('https://example.com');\n  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();\n});\n\nfunction getSubmitButton(page: Page): Locator {\n  return page.getByTestId('submit-button');\n}`,
    practice: `async function openHomePage(page: _____): Promise<void> {\n  await page.goto('https://example.com');\n}`,
    answer: `async function openHomePage(page: Page): Promise<void> {\n  await page.goto('https://example.com');\n}`,
    bullets: [
      'Page — вкладка браузера',
      'Locator — ленивый объект поиска элементов',
      'helper functions лучше типизировать явно',
    ],
  },
  {
    id: 'playwright-advanced',
    title: '11. Playwright advanced',
    minutes: '9 мин',
    category: 'playwright',
    summary: 'Page objects, typed fixtures, payload types, API helpers.',
    example: `import { Locator, Page } from '@playwright/test';\n\nexport class LoginPage {\n  readonly emailInput: Locator;\n  readonly passwordInput: Locator;\n\n  constructor(private page: Page) {\n    this.emailInput = page.getByTestId('email-input');\n    this.passwordInput = page.getByTestId('password-input');\n  }\n\n  async open(): Promise<void> {\n    await this.page.goto('/login');\n  }\n}`,
    practice: `type LoginPayload = {\n  email: string;\n  password: string;\n};\n\nasync function login(data: _____): Promise<void> {\n  console.log(data.email);\n}`,
    answer: `async function login(data: LoginPayload): Promise<void> {\n  console.log(data.email);\n}`,
  },
  {
    id: 'qa-challenges',
    title: '12. Mini challenges for QA',
    minutes: '10 мин',
    category: 'practice',
    summary: 'Небольшие упражнения на типизацию тестовых данных, locator helpers и API response shapes.',
    bullets: [
      'типизируй user с role literal union',
      'типизируй helper getNavItem(page, name)',
      'опиши response/data/status для API',
      'сделай page object для login формы',
    ],
  },
]

const progressStorageKey = 'ts-playwright-playground-progress'
const draftStorageKey = 'ts-playwright-playground-drafts'

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id)
  const [completed, setCompleted] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedProgress = localStorage.getItem(progressStorageKey)
    if (savedProgress) {
      setCompleted(JSON.parse(savedProgress) as string[])
    }

    const savedDrafts = localStorage.getItem(draftStorageKey)
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts) as Record<string, string>)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(progressStorageKey, JSON.stringify(completed))
  }, [completed])

  useEffect(() => {
    localStorage.setItem(draftStorageKey, JSON.stringify(drafts))
  }, [drafts])

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0],
    [selectedLessonId],
  )

  const progress = Math.round((completed.length / lessons.length) * 100)

  const toggleCompleted = (lessonId: string) => {
    setCompleted((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId],
    )
  }

  const toggleAnswer = (lessonId: string) => {
    setShowAnswer((current) => ({
      ...current,
      [lessonId]: !current[lessonId],
    }))
  }

  const updateDraft = (lessonId: string, value: string) => {
    setDrafts((current) => ({
      ...current,
      [lessonId]: value,
    }))
  }

  const clearDraft = (lessonId: string) => {
    setDrafts((current) => ({
      ...current,
      [lessonId]: '',
    }))
  }

  const copyTemplate = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // ignore clipboard failures on restrictive mobile browsers
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <p className="eyebrow">TypeScript + Playwright</p>
        <h1>Мобильный учебник для QA</h1>
        <p className="hero-text">
          Короткие уроки, сравнение с C#/JS/Java, практика с дописыванием кода и
          отдельный Playwright-трек.
        </p>
        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Уроков</span>
            <strong>{lessons.length}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Пройдено</span>
            <strong>{completed.length}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">Прогресс</span>
            <strong>{progress}%</strong>
          </div>
        </div>
        <div className="progress-bar" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="quick-start card">
        <h2>С чего лучше начать</h2>
        <ol>
          <li>01. Базовые типы</li>
          <li>02. Union + literal types</li>
          <li>05. Generics</li>
          <li>06. unknown + narrowing</li>
          <li>10–11. Playwright</li>
        </ol>
      </section>

      <section className="lesson-list card">
        <div className="section-head">
          <h2>Модули</h2>
          <span className="pill">mobile-first</span>
        </div>
        <div className="lesson-grid">
          {lessons.map((lesson) => {
            const done = completed.includes(lesson.id)
            const active = selectedLesson.id === lesson.id

            return (
              <button
                key={lesson.id}
                className={`lesson-tile ${active ? 'active' : ''}`}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <div className="lesson-tile-top">
                  <span className={`category ${lesson.category}`}>{lesson.category}</span>
                  <span className={`done-badge ${done ? 'done' : ''}`}>
                    {done ? '✓ done' : lesson.minutes}
                  </span>
                </div>
                <strong>{lesson.title}</strong>
                <p>{lesson.summary}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="card lesson-view">
        <div className="section-head">
          <div>
            <h2>{selectedLesson.title}</h2>
            <p className="muted">{selectedLesson.summary}</p>
          </div>
          <button
            className={`mark-button ${completed.includes(selectedLesson.id) ? 'marked' : ''}`}
            onClick={() => toggleCompleted(selectedLesson.id)}
          >
            {completed.includes(selectedLesson.id)
              ? 'Снять отметку'
              : 'Отметить как пройдено'}
          </button>
        </div>

        {selectedLesson.compare ? (
          <div className="callout compare">
            <h3>Отличие от других языков</h3>
            <p>{selectedLesson.compare}</p>
          </div>
        ) : null}

        {selectedLesson.bullets?.length ? (
          <div className="callout bullets">
            <h3>Ключевые мысли</h3>
            <ul>
              {selectedLesson.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {selectedLesson.example ? (
          <div className="block">
            <h3>Пример</h3>
            <pre>
              <code>{selectedLesson.example}</code>
            </pre>
          </div>
        ) : null}

        {selectedLesson.practice ? (
          <div className="block">
            <h3>Твоя очередь</h3>
            <p className="muted practice-hint">
              Печатай прямо здесь. Черновик сохраняется на этом устройстве автоматически.
            </p>
            <pre>
              <code>{selectedLesson.practice}</code>
            </pre>
            <textarea
              className="practice-editor"
              value={drafts[selectedLesson.id] ?? selectedLesson.practice}
              onChange={(event) => updateDraft(selectedLesson.id, event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="Впиши свой код здесь..."
            />
            <div className="practice-actions">
              <button className="secondary-button" onClick={() => toggleAnswer(selectedLesson.id)}>
                {showAnswer[selectedLesson.id] ? 'Скрыть ответ' : 'Показать ответ'}
              </button>
              <button
                className="secondary-button"
                onClick={() => copyTemplate(selectedLesson.practice ?? '')}
              >
                Скопировать шаблон
              </button>
              <button className="secondary-button danger" onClick={() => clearDraft(selectedLesson.id)}>
                Очистить
              </button>
            </div>
          </div>
        ) : null}

        {selectedLesson.answer && showAnswer[selectedLesson.id] ? (
          <div className="block answer-block">
            <h3>Один из возможных ответов</h3>
            <pre>
              <code>{selectedLesson.answer}</code>
            </pre>
          </div>
        ) : null}
      </section>

      <section className="card cheatsheet">
        <h2>Шпаргалка</h2>
        <div className="cheatsheet-grid">
          <div>
            <h3>Частые типы</h3>
            <pre>
              <code>{`string\nnumber\nboolean\nunknown\nnever\nstring[]\nRecord<K, V>`}</code>
            </pre>
          </div>
          <div>
            <h3>Playwright</h3>
            <pre>
              <code>{`import { test, expect, Page, Locator } from '@playwright/test';`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
