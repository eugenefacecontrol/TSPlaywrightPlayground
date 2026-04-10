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
    minutes: '7 мин',
    category: 'core',
    summary:
      'Как описывать форму объектов в TS: type/interface, optional поля, readonly и почему TS смотрит именно на shape объекта.',
    compare:
      'В TS важнее форма объекта, чем имя класса. Если объект подходит по полям и их типам, TS обычно считает его совместимым.',
    example: `type TestUser = {\n  readonly id: number;\n  email: string;\n  role?: 'admin' | 'manager' | 'viewer';\n};\n\nconst user: TestUser = {\n  id: 1,\n  email: 'qa@example.com',\n};`,
    practice: `type TestUser = {\n  readonly id: number;\n  email: string;\n  role?: 'admin' | 'manager' | 'viewer';\n};\n\nconst user: TestUser = {\n  id: 1,\n  email: 'qa@example.com',\n};\n\n// допиши объект ниже так, чтобы:\n// 1) id был number\n// 2) email был string\n// 3) role был optional и мог быть 'admin'\n\nconst adminUser: TestUser = {\n  _____\n};`,
    answer: `const adminUser: TestUser = {\n  id: 2,\n  email: 'admin@example.com',\n  role: 'admin',\n};`,
    bullets: [
      'type и interface часто используются похоже',
      'поле с ? можно не передавать',
      'readonly нельзя переназначать после создания',
      'TS проверяет форму объекта, а не только происхождение',
    ],
  },
  {
    id: 'functions',
    title: '04. Functions и callbacks',
    minutes: '6 мин',
    category: 'core',
    summary: 'Аргументы, return types и callback-функции — это база для helper methods и Playwright utility-кода.',
    example: `function formatResult(title: string, passed: boolean): string {\n  return passed ? \`${'${title}'}: OK\` : \`${'${title}'}: FAIL\`;\n}\n\nfunction withScreenshot(action: () => void): void {\n  action();\n}`,
    practice: `function runStep(stepName: string, action: _____): void {\n  console.log(stepName);\n  action();\n}`,
    answer: `function runStep(stepName: string, action: () => void): void {\n  console.log(stepName);\n  action();\n}`,
  },
  {
    id: 'generics',
    title: '05. Generics без боли',
    minutes: '7 мин',
    category: 'core',
    summary: 'Generic помогает писать переиспользуемый код без потери информации о типе.',
    compare:
      'Если в C#/Java generic выглядит знакомо, то в TS он часто встречается в helper functions, API wrappers и test data builders.',
    example: `function firstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst firstTag = firstItem(['smoke', 'api']);\n// firstTag: string | undefined`,
    practice: `function wrapInArray<_____>(value: _____): _____[] {\n  return [value];\n}`,
    answer: `function wrapInArray<T>(value: T): T[] {\n  return [value];\n}`,
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
    minutes: '6 мин',
    category: 'core',
    summary: 'Partial, Pick, Omit, Record — готовые инструменты, чтобы не копипастить типы.',
    example: `type User = {\n  id: number;\n  email: string;\n  role: string;\n};\n\ntype CreateUser = Omit<User, 'id'>;\ntype UserPatch = Partial<User>;\ntype UserPreview = Pick<User, 'email' | 'role'>;`,
    practice: `type Browser = 'chromium' | 'firefox' | 'webkit';\n\n// хотим хранить timeout для каждого браузера\nconst timeouts: _____ = {\n  chromium: 3000,\n  firefox: 5000,\n  webkit: 4000,\n};`,
    answer: `const timeouts: Record<Browser, number> = {\n  chromium: 3000,\n  firefox: 5000,\n  webkit: 4000,\n};`,
  },
  {
    id: 'playwright-basics',
    title: '10. Playwright basics',
    minutes: '8 мин',
    category: 'playwright',
    summary: 'Page, Locator, typed helper functions и typed test data — это основа TS в Playwright.',
    example: `import { test, expect, Page, Locator } from '@playwright/test';\n\nasync function openLoginPage(page: Page): Promise<void> {\n  await page.goto('https://example.com/login');\n}\n\nfunction getSubmitButton(page: Page): Locator {\n  return page.getByTestId('submit-button');\n}`,
    practice: `import { Page } from '@playwright/test';\n\nasync function openHomePage(page: _____): Promise<void> {\n  await page.goto('https://example.com');\n}`,
    answer: `async function openHomePage(page: Page): Promise<void> {\n  await page.goto('https://example.com');\n}`,
    bullets: [
      'Page — вкладка браузера',
      'Locator — объект для поиска элементов',
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

function normalizeCode(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function getComparison(userInput: string, expectedAnswer: string) {
  const actualLines = normalizeCode(userInput)
  const expectedLines = normalizeCode(expectedAnswer)
  const maxLength = Math.max(actualLines.length, expectedLines.length)

  const rows = Array.from({ length: maxLength }, (_, index) => {
    const actual = actualLines[index] ?? ''
    const expected = expectedLines[index] ?? ''
    const matches = actual === expected && actual !== ''

    return {
      index,
      actual,
      expected,
      matches,
    }
  })

  const matchedCount = rows.filter((row) => row.matches).length
  const score = expectedLines.length === 0 ? 0 : Math.round((matchedCount / expectedLines.length) * 100)

  return {
    rows,
    score,
    matchedCount,
    total: expectedLines.length,
  }
}

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

  const comparison = useMemo(() => {
    if (!selectedLesson.answer || !selectedLesson.practice) {
      return null
    }

    return getComparison(drafts[selectedLesson.id] ?? selectedLesson.practice, selectedLesson.answer)
  }, [drafts, selectedLesson])

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

        {comparison ? (
          <div className="block compare-block">
            <div className="compare-head">
              <h3>Насколько совпадает</h3>
              <span className="score-pill">{comparison.score}%</span>
            </div>
            <p className="muted compare-summary">
              Совпало строк: {comparison.matchedCount} из {comparison.total}
            </p>
            <div className="compare-grid">
              {comparison.rows.map((row) => (
                <div key={`${row.index}-${row.actual}-${row.expected}`} className="compare-row">
                  <div className={`compare-cell ${row.matches ? 'match' : 'miss'}`}>
                    <span className="compare-label">Твой ответ</span>
                    <code>{row.actual || '—'}</code>
                  </div>
                  <div className={`compare-cell ${row.matches ? 'match' : 'expected'}`}>
                    <span className="compare-label">Ожидалось</span>
                    <code>{row.expected || '—'}</code>
                  </div>
                </div>
              ))}
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
