import type { ReadingCategory } from '../types/tarot'

type QuestionCategory = Exclude<ReadingCategory, 'daily'>

interface CategorySelectorProps {
  value: QuestionCategory
  onChange: (category: QuestionCategory) => void
}

const categories: Array<{
  id: QuestionCategory
  symbol: string
  label: string
  description: string
}> = [
  {
    id: 'relationship',
    symbol: '♡',
    label: 'Relationship',
    description: 'Connection, needs, and boundaries',
  },
  {
    id: 'career',
    symbol: '◇',
    label: 'Career',
    description: 'Direction, choices, and confidence',
  },
  {
    id: 'self',
    symbol: '✦',
    label: 'Self',
    description: 'Emotions, patterns, and growth',
  },
]

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Reading category">
      {categories.map((category) => {
        const isSelected = category.id === value

        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(category.id)}
            className={`rounded-card border p-4 text-left transition ${
              isSelected
                ? 'border-plum-500 bg-plum-50 shadow-soft'
                : 'border-plum-100 bg-white/65 hover:border-plum-300 hover:bg-white'
            }`}
          >
            <span className="mb-4 grid size-9 place-items-center rounded-full bg-gold-200 text-lg text-plum-900">
              {category.symbol}
            </span>
            <span className="block font-serif text-lg font-semibold text-plum-950">
              {category.label}
            </span>
            <span className="mt-1 block text-sm leading-5 text-ink-500">
              {category.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export type { QuestionCategory }
