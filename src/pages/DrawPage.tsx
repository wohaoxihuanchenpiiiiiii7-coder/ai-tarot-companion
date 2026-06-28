import { useEffect, useRef, useState } from 'react'
import { BilingualLabel } from '../components/BilingualLabel'
import { SecondaryButton } from '../components/Buttons'
import { GenerationNotice } from '../components/GenerationNotice'
import { TarotCardBack } from '../components/TarotCardBack'
import { copy } from '../content/copy'
import { generateTarotReading as requestTarotReading } from '../lib/aiApi'
import { drawOneCard, drawThreeCards } from '../lib/tarot'
import {
  canGenerateReading,
  recordReadingGeneration,
} from '../lib/usageLimit'
import type { CompletedReading, ReadingSetup } from '../types/flow'
import type { DrawnCard } from '../types/tarot'

interface DrawPageProps {
  setup: ReadingSetup
  onBack: () => void
  onComplete: (reading: CompletedReading) => void
}

type GenerationError = 'error' | 'limit' | null

const CARD_BACK_COUNT = 7
const MOCK_GENERATION_DELAY = 700

export function DrawPage({ setup, onBack, onComplete }: DrawPageProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [pendingDrawnCards, setPendingDrawnCards] =
    useState<DrawnCard[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] =
    useState<GenerationError>(null)
  const generationLock = useRef(false)
  const isMounted = useRef(true)
  const requiredCards = setup.spreadType === 'one-card' ? 1 : 3

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  async function generateReading(drawnCards: DrawnCard[]) {
    if (generationLock.current) return

    if (!canGenerateReading()) {
      setGenerationError('limit')
      return
    }

    generationLock.current = true
    setIsGenerating(true)
    setGenerationError(null)
    recordReadingGeneration()

    try {
      const input = { ...setup, drawnCards }
      const [output] = await Promise.all([
        requestTarotReading(input),
        new Promise((resolve) =>
          window.setTimeout(resolve, MOCK_GENERATION_DELAY),
        ),
      ])

      if (!isMounted.current) return

      onComplete({ input, output })
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Tarot reading generation failed', error)
      }

      if (isMounted.current) {
        setGenerationError('error')
      }
    } finally {
      generationLock.current = false

      if (isMounted.current) {
        setIsGenerating(false)
      }
    }
  }

  function handleSelect(index: number) {
    if (
      isGenerating ||
      pendingDrawnCards ||
      generationLock.current ||
      selectedCards.includes(index)
    ) {
      return
    }

    const nextSelection = [...selectedCards, index]
    setSelectedCards(nextSelection)

    if (nextSelection.length === requiredCards) {
      const drawnCards =
        setup.spreadType === 'one-card' ? [drawOneCard()] : drawThreeCards()

      setPendingDrawnCards(drawnCards)
      void generateReading(drawnCards)
    }
  }

  return (
    <div className="mx-auto max-w-5xl text-center">
      <h1>
        <BilingualLabel
          {...copy.draw.title}
          variant="pageTitle"
          align="center"
        />
      </h1>
      <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-8 text-plum-900">
        {copy.draw.instruction}
      </p>
      {requiredCards === 3 && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-500">
          {copy.draw.threeCardInstruction}
        </p>
      )}
      <p className="mt-4 text-sm text-ink-500">
        {copy.draw.selectedCount(selectedCards.length, requiredCards)}
      </p>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 justify-items-center gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-6 lg:grid-cols-7">
        {Array.from({ length: CARD_BACK_COUNT }, (_, index) => (
          <TarotCardBack
            key={index}
            index={index}
            selected={selectedCards.includes(index)}
            disabled={isGenerating || pendingDrawnCards !== null}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {isGenerating && (
        <div
          className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-3 rounded-full border border-plum-100 bg-white/70 px-5 py-3 shadow-sm"
          role="status"
        >
          <span className="size-4 animate-spin rounded-full border-2 border-plum-200 border-t-plum-700" />
          <BilingualLabel
            {...copy.draw.loading}
            variant="button"
            align="center"
          />
        </div>
      )}

      {generationError && (
        <div className="mx-auto mt-10 max-w-xl">
          <GenerationNotice
            kind={generationError}
            message={
              generationError === 'limit'
                ? copy.generation.dailyLimitDescription
                : copy.generation.readingError
            }
            onRetry={
              generationError === 'error' && pendingDrawnCards
                ? () => void generateReading(pendingDrawnCards)
                : undefined
            }
          />
        </div>
      )}

      {!isGenerating && (
        <SecondaryButton onClick={onBack} className="mt-10 gap-3">
          <span aria-hidden="true">←</span>
          <BilingualLabel
            {...copy.draw.back}
            variant="button"
            align="center"
          />
        </SecondaryButton>
      )}
    </div>
  )
}
