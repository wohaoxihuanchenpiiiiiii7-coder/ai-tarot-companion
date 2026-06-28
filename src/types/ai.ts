import type {
  DrawnCard,
  ReadingCategory,
  ReadingMode,
  SpreadType,
} from './tarot'

export interface TarotReadingInput {
  mode: ReadingMode
  category: ReadingCategory
  userQuestion?: string
  optimizedQuestion?: string
  spreadType: SpreadType
  drawnCards: DrawnCard[]
}

export interface TarotReadingOutput {
  summary: string
  interpretation: string
  emotionalSupport: string
  actionSuggestion: string
  followUpPrompts: string[]
  disclaimer: string
}

export interface OptimizeQuestionInput {
  category: ReadingCategory
  rawQuestion: string
}

export interface OptimizeQuestionOutput {
  optimizedQuestion: string
  alternativeQuestions?: string[]
}
