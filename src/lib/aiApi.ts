import type {
  OptimizeQuestionInput,
  OptimizeQuestionOutput,
  TarotReadingInput,
  TarotReadingOutput,
} from '../types/ai'

async function postToInternalApi<TInput, TOutput>(
  path: string,
  input: TInput,
): Promise<TOutput> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Internal API request failed with status ${response.status}`)
  }

  return (await response.json()) as TOutput
}

export function generateTarotReading(
  input: TarotReadingInput,
): Promise<TarotReadingOutput> {
  return postToInternalApi('/api/tarot-reading', input)
}

export function optimizeQuestion(
  input: OptimizeQuestionInput,
): Promise<OptimizeQuestionOutput> {
  return postToInternalApi('/api/optimize-question', input)
}
