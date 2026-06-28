import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../types/ai'
import type { DrawnCard, ReadingCategory, SpreadType } from '../types/tarot'

const CATEGORY_LABELS: Record<ReadingCategory, string> = {
  relationship: 'relationship',
  career: 'career and future direction',
  self: 'personal growth and self-reflection',
  daily: 'day ahead',
}

const CATEGORY_ACTIONS: Record<ReadingCategory, string> = {
  relationship:
    'You might write down one need or boundary that matters to you, then choose a calm moment to express it without assuming the other person’s response.',
  career:
    'You might choose one small, reversible step—such as gathering information, asking for feedback, or testing an option—before making a larger decision.',
  self:
    'It could be helpful to pause for ten minutes and name what you feel, what you need, and one kind action you can take for yourself today.',
  daily:
    'You might carry this theme into the day by choosing one small moment to pause, notice what is present, and respond with intention.',
}

const CATEGORY_PROMPTS: Record<ReadingCategory, string[]> = {
  relationship: [
    'What need or boundary would you like to express more clearly?',
    'What part of this situation is within your control right now?',
  ],
  career: [
    'Which option feels most aligned with your values, not only your fears?',
    'What small experiment could give you useful information this week?',
  ],
  self: [
    'What feeling may be asking for your attention rather than a quick solution?',
    'What would a gentler next step look like today?',
  ],
  daily: [
    'Where could you bring a little more attention to your day?',
    'What intention would feel supportive to carry with you?',
  ],
}

const SPREAD_LABELS: Record<SpreadType, string> = {
  'one-card': 'one-card spread',
  'three-card': 'three-card spread',
}

function describeCard(drawnCard: DrawnCard): string {
  const { card, orientation, position } = drawnCard
  const positionLabel = position ?? 'overall message'

  return `${card.nameEn} (${card.nameZh}), ${orientation}, in the ${positionLabel} position`
}

function buildCardInsight(drawnCard: DrawnCard): string {
  const orientationMeaning =
    drawnCard.orientation === 'upright'
      ? drawnCard.card.uprightKeywords.join(', ')
      : drawnCard.card.reversedKeywords.join(', ')

  return `${describeCard(drawnCard)} may highlight ${orientationMeaning}. Its traditional meaning—${drawnCard.card.traditionalMeaning}—can be treated as an invitation to reflect, not a fixed outcome.`
}

export function generateMockTarotReading(
  input: TarotReadingInput,
): TarotReadingOutput {
  const categoryLabel = CATEGORY_LABELS[input.category]
  const spreadLabel = SPREAD_LABELS[input.spreadType]
  const cardNames = input.drawnCards
    .map(({ card, orientation }) => `${card.nameEn} (${orientation})`)
    .join(', ')
  const question = input.optimizedQuestion ?? input.userQuestion
  const questionContext = question ? ` around “${question}”` : ''
  const cardInsights = input.drawnCards.map(buildCardInsight).join(' ')
  const cardSummary = cardNames || 'the cards in this reading'

  return {
    summary: `For your ${categoryLabel} reflection, ${cardSummary} may invite a slower, more compassionate look at what is unfolding.`,
    emotionalSupport: `It makes sense if this ${categoryLabel} concern feels uncertain or emotionally demanding${questionContext}; you do not need to have every answer at once.`,
    interpretation: `In this ${spreadLabel}, ${cardInsights || 'the available symbols may offer a starting point for reflection.'}`,
    actionSuggestion: CATEGORY_ACTIONS[input.category],
    followUpPrompts: CATEGORY_PROMPTS[input.category],
    disclaimer:
      'This tarot reading is for self-reflection and emotional support, not a prediction or medical, legal, financial, or crisis advice.',
  }
}

function cleanConcern(rawQuestion: string): string {
  const concern = rawQuestion.trim().replace(/[.!?。！？]+$/u, '')

  return concern || 'what is currently on my mind'
}

export function optimizeMockQuestion(
  input: OptimizeQuestionInput,
): OptimizeQuestionOutput {
  const concern = cleanConcern(input.rawQuestion)
  const optimizedQuestions: Record<ReadingCategory, string> = {
    relationship: `What can I understand about my needs and boundaries in relation to “${concern}”, and what small step could support clearer communication?`,
    career: `How can I better understand what is behind “${concern}” and take a small step toward a clearer career direction?`,
    self: `What might “${concern}” reveal about my current needs, and what small supportive step can I take?`,
    daily: `How can I approach “${concern}” with greater awareness and choose one supportive intention for today?`,
  }

  return {
    optimizedQuestion: optimizedQuestions[input.category],
    alternativeQuestions: [
      `What part of “${concern}” is within my influence right now?`,
      `What would a gentle and realistic next step around “${concern}” look like?`,
    ],
  }
}
