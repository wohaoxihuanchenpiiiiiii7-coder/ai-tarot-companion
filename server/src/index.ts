import { Hono } from 'hono'
import type {
  OptimizeQuestionInput,
  TarotReadingInput,
} from '../../src/types/ai'
import type {
  CardOrientation,
  ReadingCategory,
  ReadingMode,
  SpreadType,
} from '../../src/types/tarot'
import {
  generateTarotReading,
  optimizeQuestion,
  type AiProviderConfig,
} from './lib/aiProvider'

type Bindings = AiProviderConfig

const app = new Hono<{ Bindings: Bindings }>()

const readingModes: ReadingMode[] = ['question', 'daily']
const readingCategories: ReadingCategory[] = [
  'relationship',
  'career',
  'self',
  'daily',
]
const spreadTypes: SpreadType[] = ['one-card', 'three-card']
const orientations: CardOrientation[] = ['upright', 'reversed']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTarotReadingInput(value: unknown): value is TarotReadingInput {
  if (!isRecord(value)) return false

  const cards = value.drawnCards
  const spreadType = value.spreadType

  if (
    typeof value.mode !== 'string' ||
    !readingModes.includes(value.mode as ReadingMode) ||
    typeof value.category !== 'string' ||
    !readingCategories.includes(value.category as ReadingCategory) ||
    typeof spreadType !== 'string' ||
    !spreadTypes.includes(spreadType as SpreadType) ||
    !Array.isArray(cards) ||
    cards.length !== (spreadType === 'one-card' ? 1 : 3)
  ) {
    return false
  }

  return cards.every((drawnCard) => {
    if (!isRecord(drawnCard) || !isRecord(drawnCard.card)) return false

    return (
      typeof drawnCard.card.id === 'string' &&
      typeof drawnCard.card.nameEn === 'string' &&
      typeof drawnCard.card.nameZh === 'string' &&
      typeof drawnCard.orientation === 'string' &&
      orientations.includes(drawnCard.orientation as CardOrientation)
    )
  })
}

function isOptimizeQuestionInput(value: unknown): value is OptimizeQuestionInput {
  return (
    isRecord(value) &&
    typeof value.category === 'string' &&
    readingCategories.includes(value.category as ReadingCategory) &&
    typeof value.rawQuestion === 'string' &&
    value.rawQuestion.trim().length > 0
  )
}

app.post('/api/tarot-reading', async (context) => {
  try {
    const input: unknown = await context.req.json()

    if (!isTarotReadingInput(input)) {
      return context.json({ error: 'Invalid tarot reading input.' }, 400)
    }

    const output = await generateTarotReading(input, context.env)
    return context.json(output)
  } catch {
    return context.json({ error: 'Unable to generate tarot reading.' }, 500)
  }
})

app.post('/api/optimize-question', async (context) => {
  try {
    const input: unknown = await context.req.json()

    if (!isOptimizeQuestionInput(input)) {
      return context.json({ error: 'Invalid question optimization input.' }, 400)
    }

    const output = await optimizeQuestion(input, context.env)
    return context.json(output)
  } catch {
    return context.json({ error: 'Unable to optimize question.' }, 500)
  }
})

export default app
