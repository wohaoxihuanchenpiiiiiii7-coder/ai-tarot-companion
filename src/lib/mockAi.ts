import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../types/ai'
import type {
  CardOrientation,
  DrawnCard,
  ReadingCategory,
  SpreadType,
  ThreeCardPosition,
} from '../types/tarot'

const CATEGORY_LABELS: Record<ReadingCategory, string> = {
  relationship: '情感关系',
  career: '事业与未来方向',
  self: '自我成长',
  daily: '今天的状态',
}

const CATEGORY_ACTIONS: Record<ReadingCategory, string> = {
  relationship:
    '你可以先写下一项自己真正重视的需要或边界，再选择一个平静的时刻表达它，不急着预设对方的回应。',
  career:
    '你可以先尝试一个小而可逆的行动，例如搜集一条信息、请教一个有经验的人，或用一小时体验某个方向，再决定下一步。',
  self:
    '你可以留出十分钟，分别写下“我正在感受什么”“我现在需要什么”和“今天能为自己做的一件小事”。',
  daily:
    '一个小的行动方向是：今天遇到需要回应的时刻，先停顿一次呼吸，再选择更贴近自己真实需要的做法。',
}

const FOLLOW_UP_PROMPTS = [
  '我现在可以怎么做？',
  '这张牌想提醒我什么？',
  '我需要注意什么？',
]

const SPREAD_LABELS: Record<SpreadType, string> = {
  'one-card': '单张牌解读',
  'three-card': '三张牌解读',
}

const ORIENTATION_LABELS: Record<CardOrientation, string> = {
  upright: '正位',
  reversed: '逆位',
}

const POSITION_LABELS: Record<ThreeCardPosition, string> = {
  'current situation': '问题现状',
  'hidden cause': '隐藏原因',
  'action suggestion': '行动建议',
}

function buildCardInsight(drawnCard: DrawnCard): string {
  const { card, orientation, position } = drawnCard
  const orientationLabel = ORIENTATION_LABELS[orientation]
  const positionLabel = position ? POSITION_LABELS[position] : '整体提醒'
  const keywords =
    orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords

  return `${card.nameZh}${orientationLabel}出现在“${positionLabel}”的位置，可能在提醒你关注${keywords.join('、')}。它的传统牌义是：${card.traditionalMeaning}这并不意味着结果已经确定，而是提示你留意当下正在发生的感受与选择。`
}

export function generateMockTarotReading(
  input: TarotReadingInput,
): TarotReadingOutput {
  const categoryLabel = CATEGORY_LABELS[input.category]
  const spreadLabel = SPREAD_LABELS[input.spreadType]
  const cardNames = input.drawnCards
    .map(
      ({ card, orientation }) =>
        `${card.nameZh}（${ORIENTATION_LABELS[orientation]}）`,
    )
    .join('、')
  const cardInsights = input.drawnCards.map(buildCardInsight).join(' ')
  const cardSummary = cardNames || '这次出现的牌面'

  return {
    summary: `关于${categoryLabel}，${cardSummary}可能在提醒你：先放慢一点，看看此刻真正需要被理解的部分。`,
    interpretation: `在这次${spreadLabel}中，${cardInsights || '牌面提供了一个重新理解当下的入口。'}`,
    emotionalSupport: `面对${categoryLabel}中的不确定，感到犹豫、焦虑或暂时没有答案都很正常。你不需要立刻解决所有问题，可以先允许自己看清最在意的那一部分。`,
    actionSuggestion: CATEGORY_ACTIONS[input.category],
    followUpPrompts: FOLLOW_UP_PROMPTS,
    disclaimer: '本解读不代表确定预言，仅作为自我探索和情绪梳理的参考。',
  }
}

function cleanConcern(rawQuestion: string): string {
  const concern = rawQuestion.trim().replace(/[.!?。！？]+$/u, '')

  return concern || '此刻让我在意的事情'
}

export function optimizeMockQuestion(
  input: OptimizeQuestionInput,
): OptimizeQuestionOutput {
  const concern = cleanConcern(input.rawQuestion)
  const optimizedQuestions: Record<ReadingCategory, string> = {
    relationship: `我可以怎样理解“${concern}”背后的情感需要与边界，并尝试一次更清楚的沟通？`,
    career: `我可以怎样理解自己面对“${concern}”时的焦虑，并为更清晰的事业方向迈出一个小步骤？`,
    self: `“${concern}”可能反映了我怎样的内在需要，我可以如何更温柔地回应自己？`,
    daily: `今天面对“${concern}”时，我可以带着怎样的觉察，并选择一个支持自己的行动？`,
  }

  return {
    optimizedQuestion: optimizedQuestions[input.category],
    alternativeQuestions: [
      `关于“${concern}”，现在有哪些部分是我可以影响的？`,
      `面对“${concern}”，一个温和而实际的下一步会是什么？`,
    ],
  }
}
