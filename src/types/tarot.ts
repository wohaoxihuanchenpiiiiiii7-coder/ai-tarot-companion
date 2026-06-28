export type CardOrientation = 'upright' | 'reversed'

export type SpreadType = 'one-card' | 'three-card'

export type ReadingCategory = 'relationship' | 'career' | 'self' | 'daily'

export type ReadingMode = 'question' | 'daily'

export type ThreeCardPosition =
  | 'current situation'
  | 'hidden cause'
  | 'action suggestion'

export interface TarotCard {
  id: string
  number: number
  nameEn: string
  nameZh: string
  uprightKeywords: string[]
  reversedKeywords: string[]
  traditionalMeaning: string
  imageUrl?: string
}

export interface DrawnCard {
  card: TarotCard
  orientation: CardOrientation
  position?: ThreeCardPosition
}

export interface ReadingResult {
  id: string
  createdAt: string
  mode: ReadingMode
  category: ReadingCategory
  userQuestion?: string
  optimizedQuestion?: string
  spreadType: SpreadType
  drawnCards: DrawnCard[]
  summary: string
  interpretation: string
  emotionalSupport: string
  actionSuggestion: string
  followUpPrompts: string[]
  disclaimer: string
}
