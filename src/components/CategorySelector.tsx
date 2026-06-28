import { copy } from '../content/copy'
import type { ReadingCategory } from '../types/tarot'
import { BilingualLabel } from './BilingualLabel'

type QuestionCategory = Exclude<ReadingCategory, 'daily'>

interface CategorySelectorProps {
  value: QuestionCategory
  onChange: (category: QuestionCategory) => void
  disabled?: boolean
}

const categories: Array<{
  id: QuestionCategory
  symbol: string
}> = [
  { id: 'relationship', symbol: '♡' },
  { id: 'career', symbol: '◇' },
  { id: 'self', symbol: '✦' },
]

export function CategorySelector({
  value,
  onChange,
  disabled = false,
}: CategorySelectorProps) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="radiogroup"
      aria-label={copy.question.categoryTitle.zh}
    >
      {categories.map((category) => {
        const isSelected = category.id === value
        const categoryCopy = copy.categories[category.id]

        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(category.id)}
            className={`rounded-card border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
              isSelected
                ? 'border-plum-500 bg-plum-50 shadow-soft'
                : 'border-plum-100 bg-white/65 hover:border-plum-300 hover:bg-white'
            }`}
          >
            <span className="mb-4 grid size-9 place-items-center rounded-full bg-gold-200 text-lg text-plum-900">
              {category.symbol}
            </span>
            <BilingualLabel {...categoryCopy.label} variant="option" />
            <span className="mt-3 block text-sm leading-5 text-ink-500">
              {categoryCopy.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export type { QuestionCategory }
