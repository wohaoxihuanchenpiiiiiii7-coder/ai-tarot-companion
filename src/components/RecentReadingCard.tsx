import { copy } from '../content/copy'
import type { ReadingResult } from '../types/tarot'
import { BilingualLabel } from './BilingualLabel'

interface RecentReadingCardProps {
  reading: ReadingResult
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function RecentReadingCard({ reading }: RecentReadingCardProps) {
  const firstDrawnCard = reading.drawnCards[0]
  const categoryCopy = copy.categories[reading.category]
  const spreadCopy = copy.spreads[reading.spreadType]
  const orientationCopy = copy.orientations[firstDrawnCard.orientation]

  return (
    <article className="rounded-card border border-plum-100 bg-white/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-xl bg-plum-50 px-3 py-2">
            <BilingualLabel
              {...categoryCopy.label}
              variant="helper"
              align="center"
            />
          </span>
          <span className="rounded-xl bg-gold-100 px-3 py-2">
            <BilingualLabel
              {...spreadCopy.label}
              variant="helper"
              align="center"
            />
          </span>
        </div>
        <time
          dateTime={reading.createdAt}
          className="shrink-0 text-xs text-ink-400"
        >
          {dateFormatter.format(new Date(reading.createdAt))}
        </time>
      </div>

      <p className="mt-5 line-clamp-3 font-serif text-lg leading-7 text-plum-950">
        {reading.summary}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-plum-100 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-plum-800 text-gold-200">
          ✦
        </span>
        <div className="min-w-0">
          <p className="text-xs text-ink-400">{copy.home.firstCard}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-plum-900">
            {firstDrawnCard.card.nameZh}
            <span className="ml-1 font-normal text-ink-400">
              {firstDrawnCard.card.nameEn}
            </span>
          </p>
        </div>
        <span className="ml-auto rounded-full border border-plum-100 px-2.5 py-1.5">
          <BilingualLabel
            {...orientationCopy}
            variant="helper"
            align="center"
          />
        </span>
      </div>
    </article>
  )
}
