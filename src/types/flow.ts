import type { TarotReadingInput, TarotReadingOutput } from './ai'

export type ReadingSetup = Omit<TarotReadingInput, 'drawnCards'>

export interface CompletedReading {
  input: TarotReadingInput
  output: TarotReadingOutput
}
