import { useState } from 'react'
import { BilingualLabel } from '../components/BilingualLabel'
import { SecondaryButton } from '../components/Buttons'
import { TarotCardBack } from '../components/TarotCardBack'
import { copy } from '../content/copy'
import { generateMockTarotReading } from '../lib/mockAi'
import { drawOneCard, drawThreeCards } from '../lib/tarot'
import type { CompletedReading, ReadingSetup } from '../types/flow'

interface DrawPageProps {
  setup: ReadingSetup
  onBack: () => void
  onComplete: (reading: CompletedReading) => void
}

const CARD_BACK_COUNT = 7

export function DrawPage({ setup, onBack, onComplete }: DrawPageProps) {
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const requiredCards = setup.spreadType === 'one-card' ? 1 : 3

  function completeReading() {
    const drawnCards =
      setup.spreadType === 'one-card' ? [drawOneCard()] : drawThreeCards()
    const input = { ...setup, drawnCards }
    const output = generateMockTarotReading(input)

    onComplete({ input, output })
  }

  function handleSelect(index: number) {
    if (isLoading || selectedCards.includes(index)) return

    const nextSelection = [...selectedCards, index]
    setSelectedCards(nextSelection)

    if (nextSelection.length === requiredCards) {
      setIsLoading(true)
      window.setTimeout(completeReading, 700)
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
        {isLoading
          ? copy.draw.loading
          : copy.draw.selectedCount(selectedCards.length, requiredCards)}
      </p>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 justify-items-center gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-6 lg:grid-cols-7">
        {Array.from({ length: CARD_BACK_COUNT }, (_, index) => (
          <TarotCardBack
            key={index}
            index={index}
            selected={selectedCards.includes(index)}
            disabled={isLoading}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-3 rounded-full border border-plum-100 bg-white/70 px-5 py-3 text-sm text-plum-700 shadow-sm">
          <span className="size-4 animate-spin rounded-full border-2 border-plum-200 border-t-plum-700" />
          {copy.draw.loading}
        </div>
      ) : (
        <SecondaryButton onClick={onBack} className="mt-12 gap-3">
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
