import { generateMockTarotReading, optimizeMockQuestion } from '../../../src/lib/mockAi'
import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../../../src/types/ai'
import { createDeepSeekProvider } from './deepseekProvider'
import { AiProviderError } from './aiProviderError'

export type AiProviderName = 'mock' | 'deepseek'

export interface AiProviderConfig {
  AI_PROVIDER?: string
  AI_API_KEY?: string
  AI_BASE_URL?: string
  AI_MODEL?: string
}

interface AiProvider {
  generateTarotReading(input: TarotReadingInput): Promise<TarotReadingOutput>
  optimizeQuestion(input: OptimizeQuestionInput): Promise<OptimizeQuestionOutput>
}

const mockProvider: AiProvider = {
  async generateTarotReading(input) {
    return generateMockTarotReading(input)
  },
  async optimizeQuestion(input) {
    return optimizeMockQuestion(input)
  },
}

function selectProvider(config: AiProviderConfig = {}): AiProvider {
  const requestedProvider = config.AI_PROVIDER?.trim().toLowerCase() || 'mock'

  if (requestedProvider === 'mock') {
    return mockProvider
  }

  if (requestedProvider === 'deepseek') {
    const apiKey = config.AI_API_KEY?.trim()
    const baseUrl = config.AI_BASE_URL?.trim()
    const model = config.AI_MODEL?.trim()

    if (
      !apiKey ||
      apiKey === 'your_api_key_here' ||
      !baseUrl ||
      !model ||
      model === 'your_model_here'
    ) {
      throw new AiProviderError(
        'DeepSeek requires AI_API_KEY, AI_BASE_URL, and AI_MODEL.',
        503,
        'DeepSeek provider is not configured.',
      )
    }

    return createDeepSeekProvider({ apiKey, baseUrl, model })
  }

  throw new AiProviderError(
    `Unsupported AI provider: ${requestedProvider}`,
    503,
    'AI provider is not configured.',
  )
}

export async function generateTarotReading(
  input: TarotReadingInput,
  config?: AiProviderConfig,
): Promise<TarotReadingOutput> {
  return selectProvider(config).generateTarotReading(input)
}

export async function optimizeQuestion(
  input: OptimizeQuestionInput,
  config?: AiProviderConfig,
): Promise<OptimizeQuestionOutput> {
  return selectProvider(config).optimizeQuestion(input)
}
