import type {
  CardOrientation,
  DrawnCard,
  ReadingCategory,
  ReadingMode,
  ReadingResult,
  SpreadType,
  TarotCard,
  ThreeCardPosition,
} from '../types/tarot'

const STORAGE_KEY = 'ai-tarot-companion:recent-readings'
const MAX_RECENT_READINGS = 3

const readingModes: ReadingMode[] = ['question', 'daily']
const readingCategories: ReadingCategory[] = [
  'relationship',
  'career',
  'self',
  'daily',
]
const spreadTypes: SpreadType[] = ['one-card', 'three-card']
const orientations: CardOrientation[] = ['upright', 'reversed']
const positions: ThreeCardPosition[] = [
  'current situation',
  'hidden cause',
  'action suggestion',
]

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isTarotCard(value: unknown): value is TarotCard {
  if (!value || typeof value !== 'object') return false

  const card = value as Partial<TarotCard>

  return (
    typeof card.id === 'string' &&
    typeof card.number === 'number' &&
    typeof card.nameEn === 'string' &&
    typeof card.nameZh === 'string' &&
    isStringArray(card.uprightKeywords) &&
    isStringArray(card.reversedKeywords) &&
    typeof card.traditionalMeaning === 'string' &&
    (card.imageUrl === undefined || typeof card.imageUrl === 'string')
  )
}

function isDrawnCard(value: unknown): value is DrawnCard {
  if (!value || typeof value !== 'object') return false

  const drawnCard = value as Partial<DrawnCard>

  return (
    isTarotCard(drawnCard.card) &&
    orientations.includes(drawnCard.orientation as CardOrientation) &&
    (drawnCard.position === undefined ||
      positions.includes(drawnCard.position as ThreeCardPosition))
  )
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string'
}

function isReadingResult(value: unknown): value is ReadingResult {
  if (!value || typeof value !== 'object') return false

  const reading = value as Partial<ReadingResult>

  return (
    typeof reading.id === 'string' &&
    reading.id.length > 0 &&
    typeof reading.createdAt === 'string' &&
    !Number.isNaN(Date.parse(reading.createdAt)) &&
    readingModes.includes(reading.mode as ReadingMode) &&
    readingCategories.includes(reading.category as ReadingCategory) &&
    isOptionalString(reading.userQuestion) &&
    isOptionalString(reading.optimizedQuestion) &&
    spreadTypes.includes(reading.spreadType as SpreadType) &&
    Array.isArray(reading.drawnCards) &&
    reading.drawnCards.length > 0 &&
    reading.drawnCards.every(isDrawnCard) &&
    typeof reading.summary === 'string' &&
    typeof reading.interpretation === 'string' &&
    typeof reading.emotionalSupport === 'string' &&
    typeof reading.actionSuggestion === 'string' &&
    isStringArray(reading.followUpPrompts) &&
    typeof reading.disclaimer === 'string'
  )
}

export function getRecentReadings(): ReadingResult[] {
  const storage = getStorage()

  if (!storage) return []

  try {
    const storedValue = storage.getItem(STORAGE_KEY)

    if (!storedValue) return []

    const parsedValue: unknown = JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) return []

    return parsedValue
      .filter(isReadingResult)
      .sort(
        (first, second) =>
          Date.parse(second.createdAt) - Date.parse(first.createdAt),
      )
      .slice(0, MAX_RECENT_READINGS)
  } catch {
    return []
  }
}

export function saveReading(reading: ReadingResult): ReadingResult[] {
  const readingsWithoutDuplicate = getRecentReadings().filter(
    (savedReading) => savedReading.id !== reading.id,
  )
  const nextReadings = [reading, ...readingsWithoutDuplicate].slice(
    0,
    MAX_RECENT_READINGS,
  )
  const storage = getStorage()

  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(nextReadings))
    } catch {
      return nextReadings
    }
  }

  return nextReadings
}

export function clearRecentReadings(): void {
  const storage = getStorage()

  if (!storage) return

  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}
