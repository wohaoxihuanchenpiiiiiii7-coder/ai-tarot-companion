import type {
  CardOrientation,
  ReadingCategory,
  SpreadType,
  ThreeCardPosition,
} from '../types/tarot'

export interface BilingualText {
  zh: string
  en: string
}

export const copy = {
  brand: {
    name: { zh: 'AI 塔罗陪伴', en: 'AI Tarot Companion' },
    headerNote: { zh: '温柔地看见自己', en: 'A gentle space to reflect' },
  },
  home: {
    eyebrow: { zh: '暂停 · 感受 · 温柔前行', en: 'Pause · Reflect · Move gently' },
    title: { zh: 'AI 塔罗陪伴', en: 'AI Tarot Companion' },
    subtitle: '用一张牌，陪你整理此刻的困惑。',
    description:
      '这不是确定的预言，而是一次温柔的自我探索。你可以提出一个具体问题，也可以抽取今日塔罗，获得一段结合牌面与当下状态的 AI 解读。',
    askQuestion: { zh: '问一个问题', en: 'Ask a Question' },
    dailyTarot: { zh: '今日塔罗', en: 'Daily Tarot' },
    mockNote: '当前使用本地模拟 AI 生成解读，不会发送你的内容。',
    cardMessage: '向内看',
    cardWhisper: '感受当下',
    recentReadings: { zh: '最近记录', en: 'Recent Readings' },
    latestThree: '最近 3 条',
    clearHistory: { zh: '清空记录', en: 'Clear History' },
    emptyDescription: '还没有抽牌记录。完成一次解读后，它会出现在这里。',
    firstCard: '首张牌',
  },
  question: {
    pageTitle: { zh: '问一个问题', en: 'Ask a Question' },
    pageDescription: '不需要组织出完美的语言，从此刻最真实的感受开始就好。',
    categoryTitle: { zh: '你想探索哪一类问题？', en: 'Choose a Theme' },
    questionTitle: { zh: '写下你此刻的困惑', en: 'Write Your Question' },
    questionPlaceholder: '例如：我最近对未来实习方向有点迷茫，不知道该怎么选择。',
    refine: { zh: '帮我整理成更清楚的问题', en: 'Refine with AI' },
    drawDirectly: { zh: '直接抽牌', en: 'Draw Directly' },
    refinedTitle: { zh: 'AI 帮你整理的问题', en: 'AI-refined Question' },
    useQuestion: { zh: '使用这个问题', en: 'Use This Question' },
    keepOriginal: { zh: '保留原问题', en: 'Keep Original' },
    spreadTitle: { zh: '选择你的牌阵', en: 'Choose a Spread' },
    spreadHelper: '选择你希望从几个角度理解此刻的问题。',
    continueToDraw: { zh: '继续抽牌', en: 'Continue to Draw' },
  },
  draw: {
    title: { zh: '抽取你的牌', en: 'Draw Your Card' },
    instruction: '深呼吸一下，想着你的问题，从牌组中选择一张牌。',
    threeCardInstruction:
      '请依次选择三张牌，它们将分别代表：问题现状、隐藏原因、行动建议。',
    selectedCount: (count: number, required: number) =>
      `已选择 ${count} / ${required} 张`,
    loading: { zh: '正在生成解读……', en: 'Generating Reading' },
    back: { zh: '返回上一步', en: 'Go Back' },
    chooseCard: (index: number) => `第 ${index + 1} 张塔罗牌背`,
    chosen: '已选择',
  },
  generation: {
    refiningQuestion: { zh: '正在整理问题……', en: 'Refining Question' },
    errorTitle: { zh: '暂时没有生成成功', en: 'Something Went Wrong' },
    readingError:
      '这次解读没有顺利生成。你可以稍后再试，或重新抽取一次。',
    optimizationError:
      '这次问题整理没有顺利完成。你可以稍后再试，或直接使用原问题。',
    dailyLimitReached: {
      zh: '今日生成次数已达上限',
      en: 'Daily Limit Reached',
    },
    dailyLimitDescription:
      '为了避免重复生成和控制 AI 调用成本，今天的生成次数已达到上限。你可以明天再来，或查看最近记录。',
  },
  result: {
    pageTitle: { zh: '你的塔罗解读', en: 'Your Tarot Reading' },
    keyMessage: { zh: '一句话提醒', en: 'Key Message' },
    drawnCards: { zh: '抽到的牌', en: 'Drawn Cards' },
    personalizedReading: { zh: '个性化解读', en: 'Personalized Reading' },
    emotionalSupport: { zh: '情绪回应', en: 'Emotional Support' },
    actionStep: { zh: '行动建议', en: 'Action Step' },
    continueExploring: { zh: '继续探索', en: 'Continue Exploring' },
    traditionalMeaning: { zh: '传统牌义', en: 'Traditional Meaning' },
    viewMeaning: { zh: '查看传统牌义', en: 'View Meaning' },
    hideMeaning: { zh: '收起传统牌义', en: 'Hide Meaning' },
    copyReading: { zh: '复制解读', en: 'Copy Reading' },
    copied: { zh: '已复制', en: 'Copied' },
    copyUnavailable: { zh: '暂时无法复制', en: 'Copy Unavailable' },
    backHome: { zh: '返回首页', en: 'Back Home' },
    retry: { zh: '重新生成', en: 'Retry' },
    disclaimer: '本解读不代表确定预言，仅作为自我探索和情绪梳理的参考。',
  },
  categories: {
    relationship: {
      label: { zh: '情感', en: 'Relationship' },
      description: '关系中的感受、需要与边界',
    },
    career: {
      label: { zh: '事业', en: 'Career' },
      description: '方向、选择与行动信心',
    },
    self: {
      label: { zh: '自我', en: 'Self' },
      description: '情绪、内在模式与成长',
    },
    daily: {
      label: { zh: '今日', en: 'Daily' },
      description: '给今天的一份温柔提醒',
    },
  } satisfies Record<ReadingCategory, { label: BilingualText; description: string }>,
  spreads: {
    'one-card': {
      label: { zh: '单张牌', en: 'One-card Spread' },
      description: '适合快速获得一个方向',
    },
    'three-card': {
      label: { zh: '三张牌', en: 'Three-card Spread' },
      description: '从问题现状、隐藏原因、行动建议三个角度展开',
    },
  } satisfies Record<SpreadType, { label: BilingualText; description: string }>,
  orientations: {
    upright: { zh: '正位', en: 'Upright' },
    reversed: { zh: '逆位', en: 'Reversed' },
  } satisfies Record<CardOrientation, BilingualText>,
  positions: {
    'current situation': { zh: '问题现状', en: 'Current Situation' },
    'hidden cause': { zh: '隐藏原因', en: 'Hidden Cause' },
    'action suggestion': { zh: '行动建议', en: 'Action Suggestion' },
  } satisfies Record<ThreeCardPosition, BilingualText>,
}
