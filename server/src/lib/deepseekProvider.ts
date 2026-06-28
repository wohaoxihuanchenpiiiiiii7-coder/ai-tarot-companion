import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../../../src/types/ai'
import type { DrawnCard } from '../../../src/types/tarot'
import { AiProviderError } from './aiProviderError'

export interface DeepSeekConfig {
  apiKey: string
  baseUrl: string
  model: string
}

interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

interface ChatRequestOptions<T> {
  messages: ChatMessage[]
  temperature: number
  maxTokens: number
  validate: (value: unknown) => value is T
}

const TAROT_SYSTEM_PROMPT = `你是 AI 塔罗陪伴中的温柔反思伙伴。

产品定位：塔罗只是情绪支持与自我探索的互动隐喻，不是确定性的算命工具。你不能预测命运，也不能断言他人的内心、意图或未来行为。

表达要求：
- 所有详细内容只使用简体中文。
- 语气温暖、克制、有共情、有洞察，并尊重用户的自主选择。
- 使用“这张牌可能在提醒你”“一种可能的理解是”“你可以考虑”等可能性语言。
- 不作绝对预测，不因牌面要求用户立即作出重大决定。
- 给出一个具体、温和、可执行的小行动。
- 不提供医疗、法律、金融或危机处理建议；严重痛苦或自伤风险应温和鼓励用户立即联系可信任的人和当地专业支持。

你必须只返回合法 JSON，不要输出 Markdown、代码围栏或 JSON 之外的内容。JSON 结构示例：
{"summary":"一句话提醒","interpretation":"结合牌面的个性化解读","emotionalSupport":"温柔的情绪回应","actionSuggestion":"一个具体小行动","followUpPrompts":["继续探索问题一","继续探索问题二","继续探索问题三"],"disclaimer":"本解读不代表确定预言，仅作为自我探索和情绪梳理的参考。"}`

const OPTIMIZE_SYSTEM_PROMPT = `你是 AI 塔罗陪伴的问题整理助手。你的任务是把用户的困惑改写成清晰、开放、面向自我反思的问题，而不是预测结果。

要求：
- 默认只使用简体中文。
- 保留用户真正关心的主题，不替用户下结论。
- 避免“会不会一定发生”“他是否肯定爱我”等确定性算命表达。
- 让问题聚焦于可理解的感受、需要、选择或一个可行动的下一步。
- 可以提供最多 3 个备选问题。

你必须只返回合法 JSON，不要输出 Markdown、代码围栏或 JSON 之外的内容。JSON 结构示例：
{"optimizedQuestion":"更清晰的自我反思问题","alternativeQuestions":["备选问题一","备选问题二"]}`

function describeCard(drawnCard: DrawnCard, index: number): string {
  return [
    `牌 ${index + 1}`,
    `名称：${drawnCard.card.nameZh} / ${drawnCard.card.nameEn}`,
    `方向：${drawnCard.orientation}`,
    `位置：${drawnCard.position ?? 'overall message'}`,
    `传统牌义：${drawnCard.card.traditionalMeaning}`,
  ].join('\n')
}

function buildTarotUserPrompt(input: TarotReadingInput): string {
  return `请依据以下结构化输入生成一份温柔的塔罗反思解读。

解读模式：${input.mode}
主题分类：${input.category}
用户问题：${input.userQuestion ?? '未提供'}
整理后的问题：${input.optimizedQuestion ?? '未提供'}
牌阵：${input.spreadType}

抽到的牌：
${input.drawnCards.map(describeCard).join('\n\n')}

请联系用户问题、每张牌的名称、方向、位置和传统牌义进行解读。不要作确定预测。输出必须是符合示例结构的合法 JSON，且所有字段内容必须为简体中文。followUpPrompts 请提供 2 至 3 项。`
}

function buildOptimizeUserPrompt(input: OptimizeQuestionInput): string {
  return `请将下面的困惑整理成一个更清晰、开放、面向自我反思的问题。

主题分类：${input.category}
原始困惑：${input.rawQuestion}

不要预测结果，也不要替用户断言他人的想法。输出必须是符合示例结构的合法 JSON。`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(
  value: unknown,
  minimum: number,
  maximum: number,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minimum &&
    value.length <= maximum &&
    value.every(isNonEmptyString)
  )
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: string[],
): boolean {
  return Object.keys(value).every((key) => allowedKeys.includes(key))
}

function isTarotReadingOutput(value: unknown): value is TarotReadingOutput {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      'summary',
      'interpretation',
      'emotionalSupport',
      'actionSuggestion',
      'followUpPrompts',
      'disclaimer',
    ]) &&
    isNonEmptyString(value.summary) &&
    isNonEmptyString(value.interpretation) &&
    isNonEmptyString(value.emotionalSupport) &&
    isNonEmptyString(value.actionSuggestion) &&
    isStringArray(value.followUpPrompts, 2, 3) &&
    isNonEmptyString(value.disclaimer)
  )
}

function isOptimizeQuestionOutput(
  value: unknown,
): value is OptimizeQuestionOutput {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['optimizedQuestion', 'alternativeQuestions']) &&
    isNonEmptyString(value.optimizedQuestion) &&
    (value.alternativeQuestions === undefined ||
      isStringArray(value.alternativeQuestions, 1, 3))
  )
}

async function requestStructuredOutput<T>(
  config: DeepSeekConfig,
  options: ChatRequestOptions<T>,
): Promise<T> {
  const endpoint = `${config.baseUrl.replace(/\/+$/u, '')}/chat/completions`
  let response: Response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: options.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        response_format: { type: 'json_object' },
        stream: false,
      }),
      signal: AbortSignal.timeout(60_000),
    })
  } catch {
    throw new AiProviderError(
      'DeepSeek request could not be completed.',
      502,
      'AI provider request failed.',
    )
  }

  if (!response.ok) {
    throw new AiProviderError(
      `DeepSeek returned HTTP ${response.status}.`,
      502,
      'AI provider request failed.',
    )
  }

  let responseBody: unknown

  try {
    responseBody = await response.json()
  } catch {
    throw new AiProviderError(
      'DeepSeek returned an unreadable response.',
      502,
      'AI provider returned an invalid response.',
    )
  }

  const content =
    isRecord(responseBody) &&
    Array.isArray(responseBody.choices) &&
    isRecord(responseBody.choices[0]) &&
    isRecord(responseBody.choices[0].message)
      ? responseBody.choices[0].message.content
      : undefined

  if (!isNonEmptyString(content)) {
    throw new AiProviderError(
      'DeepSeek returned empty structured content.',
      502,
      'AI provider returned an invalid response.',
    )
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(content)
  } catch {
    throw new AiProviderError(
      'DeepSeek returned invalid JSON.',
      502,
      'AI provider returned invalid structured output.',
    )
  }

  if (!options.validate(parsed)) {
    throw new AiProviderError(
      'DeepSeek JSON did not match the expected output contract.',
      502,
      'AI provider returned invalid structured output.',
    )
  }

  return parsed
}

export function createDeepSeekProvider(config: DeepSeekConfig) {
  return {
    generateTarotReading(input: TarotReadingInput) {
      return requestStructuredOutput(config, {
        messages: [
          { role: 'system', content: TAROT_SYSTEM_PROMPT },
          { role: 'user', content: buildTarotUserPrompt(input) },
        ],
        temperature: 0.7,
        maxTokens: 1800,
        validate: isTarotReadingOutput,
      })
    },
    optimizeQuestion(input: OptimizeQuestionInput) {
      return requestStructuredOutput(config, {
        messages: [
          { role: 'system', content: OPTIMIZE_SYSTEM_PROMPT },
          { role: 'user', content: buildOptimizeUserPrompt(input) },
        ],
        temperature: 0.4,
        maxTokens: 700,
        validate: isOptimizeQuestionOutput,
      })
    },
  }
}
