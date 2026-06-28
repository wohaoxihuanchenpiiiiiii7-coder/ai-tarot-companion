import type { SpreadType } from '../types/tarot'

interface SpreadSelectorProps {
  value: SpreadType
  onChange: (spread: SpreadType) => void
}

const spreads: Array<{
  id: SpreadType
  label: string
  description: string
  cardCount: number
}> = [
  {
    id: 'one-card',
    label: 'One card',
    description: 'A focused message for this moment',
    cardCount: 1,
  },
  {
    id: 'three-card',
    label: 'Three cards',
    description: 'Situation, hidden cause, and action',
    cardCount: 3,
  },
]

export function SpreadSelector({ value, onChange }: SpreadSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tarot spread">
      {spreads.map((spread) => {
        const isSelected = spread.id === value

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
              <span className="block font-serif text-lg font-semibold text-plum-950">
                {spread.label}
              </span>
              <span className="mt-1 block text-sm text-ink-500">
                {spread.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
