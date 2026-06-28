import { useState } from 'react'
import { copy } from '../content/copy'
import type { DrawnCard } from '../types/tarot'
import { BilingualLabel } from './BilingualLabel'

interface DrawnCardDisplayProps {
  drawnCard: DrawnCard
}

export function DrawnCardDisplay({ drawnCard }: DrawnCardDisplayProps) {
  const [showMeaning, setShowMeaning] = useState(false)
  const { card, orientation, position } = drawnCard
  const keywords =
    orientation === 'upright' ? card.uprightKeywords : card.reversedKeywords

  return (
    <article className="rounded-card border border-plum-100 bg-white/70 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setShowMeaning((current) => !current)}
        className="w-full text-left"
        aria-expanded={showMeaning}
      >
        <div
          className={`mx-auto grid aspect-[2/3.15] w-28 place-items-center rounded-xl border border-gold-300 bg-plum-800 px-3 text-center text-cream-50 shadow-card ${
            orientation === 'reversed' ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <span className="text-3xl text-gold-200">✦</span>
        </div>
        <div className="mt-5 text-center">
          {position && (
            <BilingualLabel
              {...copy.positions[position]}
              variant="helper"
              align="center"
            />
          )}
          <h3 className={position ? 'mt-4' : ''}>
            <BilingualLabel
              zh={card.nameZh}
              en={card.nameEn}
              variant="option"
              align="center"
            />
          </h3>
          <span className="mt-3 inline-flex rounded-full bg-plum-50 px-3 py-2">
            <BilingualLabel
              {...copy.orientations[orientation]}
              variant="helper"
              align="center"
            />
          </span>
          <p className="mt-3 text-xs leading-5 text-ink-500">{keywords.join(' · ')}</p>
          <span className="mt-4 block">
            <BilingualLabel
              {...(showMeaning
                ? copy.result.hideMeaning
                : copy.result.viewMeaning)}
              variant="helper"
              align="center"
            />
          </span>
        </div>
      </button>

      {showMeaning && (
        <div className="mt-4 border-t border-plum-100 pt-4">
          <BilingualLabel
            {...copy.result.traditionalMeaning}
            variant="helper"
          />
          <p className="mt-3 text-sm leading-7 text-ink-600">
            {card.traditionalMeaning}
          </p>
        </div>
      )}
    </article>
  )
}
