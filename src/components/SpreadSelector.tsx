import { copy } from '../content/copy'
import type { SpreadType } from '../types/tarot'
import { BilingualLabel } from './BilingualLabel'

interface SpreadSelectorProps {
  value: SpreadType
  onChange: (spread: SpreadType) => void
}

const spreads: Array<{ id: SpreadType; cardCount: number }> = [
  { id: 'one-card', cardCount: 1 },
  { id: 'three-card', cardCount: 3 },
]

export function SpreadSelector({ value, onChange }: SpreadSelectorProps) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label={copy.question.spreadTitle.zh}
    >
      {spreads.map((spread) => {
        const isSelected = spread.id === value
        const spreadCopy = copy.spreads[spread.id]

        return (
          <button
            key={spread.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(spread.id)}
            className={`flex items-center gap-4 rounded-card border p-4 text-left transition ${
              isSelected
                ? 'border-plum-500 bg-plum-50 shadow-soft'
                : 'border-plum-100 bg-white/65 hover:border-plum-300 hover:bg-white'
            }`}
          >
            <span className="flex min-w-14 justify-center gap-0.5" aria-hidden="true">
              {Array.from({ length: spread.cardCount }, (_, index) => (
                <span
                  key={index}
                  className="h-10 w-6 rounded border border-plum-400 bg-plum-700"
                />
              ))}
            </span>
            <span>
              <BilingualLabel {...spreadCopy.label} variant="option" />
              <span className="mt-3 block text-sm leading-5 text-ink-500">
                {spreadCopy.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
