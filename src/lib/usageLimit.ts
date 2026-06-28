export const DAILY_USAGE_LIMIT = 10

const USAGE_STORAGE_KEY = 'ai-tarot-companion:daily-usage'

export interface DailyUsage {
  date: string
  readingGenerations: number
  questionOptimizations: number
}

let memoryUsage: DailyUsage | null = null

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isValidUsage(value: unknown): value is DailyUsage {
  if (!value || typeof value !== 'object') return false

  const usage = value as Partial<DailyUsage>

  return (
    typeof usage.date === 'string' &&
    Number.isInteger(usage.readingGenerations) &&
    Number(usage.readingGenerations) >= 0 &&
    Number.isInteger(usage.questionOptimizations) &&
    Number(usage.questionOptimizations) >= 0
  )
}

function readUsage(): DailyUsage | null {
  const storage = getStorage()

  if (!storage) return memoryUsage

  try {
    const storedValue = storage.getItem(USAGE_STORAGE_KEY)

    if (!storedValue) return memoryUsage

    const parsedValue: unknown = JSON.parse(storedValue)

    return isValidUsage(parsedValue) ? parsedValue : null
  } catch {
    return memoryUsage
  }
}

function writeUsage(usage: DailyUsage): DailyUsage {
  memoryUsage = usage
  const storage = getStorage()

  if (storage) {
    try {
      storage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage))
    } catch {
      return usage
    }
  }

  return usage
}

export function resetUsageIfNeeded(now = new Date()): DailyUsage {
  const today = getLocalDateKey(now)
  const storedUsage = readUsage()

  if (!storedUsage || storedUsage.date !== today) {
    return writeUsage({
      date: today,
      readingGenerations: 0,
      questionOptimizations: 0,
    })
  }

  return storedUsage
}

export function getTodayUsage(now = new Date()): DailyUsage {
  return resetUsageIfNeeded(now)
}

export function canGenerateReading(now = new Date()): boolean {
  return getTodayUsage(now).readingGenerations < DAILY_USAGE_LIMIT
}

export function canOptimizeQuestion(now = new Date()): boolean {
  return getTodayUsage(now).questionOptimizations < DAILY_USAGE_LIMIT
}

export function recordReadingGeneration(now = new Date()): DailyUsage {
  const usage = getTodayUsage(now)

  return writeUsage({
    ...usage,
    readingGenerations: Math.min(
      usage.readingGenerations + 1,
      DAILY_USAGE_LIMIT,
    ),
  })
}

export function recordQuestionOptimization(now = new Date()): DailyUsage {
  const usage = getTodayUsage(now)

  return writeUsage({
    ...usage,
    questionOptimizations: Math.min(
      usage.questionOptimizations + 1,
      DAILY_USAGE_LIMIT,
    ),
  })
}
