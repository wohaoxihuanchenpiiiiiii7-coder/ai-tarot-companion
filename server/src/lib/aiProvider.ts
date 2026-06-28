import { generateMockTarotReading, optimizeMockQuestion } from '../../../src/lib/mockAi'
import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../../../src/types/ai'

export type AiProviderName = 'mock'

export interface AiProviderConfig {
  AI_PROVIDER?: string
  AI_API_KEY?: string
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

  // Future providers belong here. Until one is intentionally implemented,
  // an unknown or unavailable provider safely falls back to the mock contract.
  if (requestedProvider !== 'mock') {
    return mockProvider
  }

  return mockProvider
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
