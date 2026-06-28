import { useState } from 'react'
import type { DrawnCard } from '../types/tarot'

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
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-plum-500">
              {position}
            </p>
          )}
          <h3 className="mt-1 font-serif text-xl font-semibold text-plum-950">
            {card.nameEn}
          </h3>
          <p className="text-sm text-ink-500">{card.nameZh}</p>
          <span className="mt-3 inline-flex rounded-full bg-plum-50 px-3 py-1 text-xs font-semibold capitalize text-plum-700">
            {orientation}
          </span>
          <p className="mt-3 text-xs leading-5 text-ink-500">{keywords.join(' · ')}</p>
          <p className="mt-4 text-xs font-semibold text-plum-700">
            {showMeaning ? 'Hide traditional meaning' : 'View traditional meaning'}
          </p>
        </div>
      </button>

      {showMeaning && (
        <p className="mt-4 border-t border-plum-100 pt-4 text-sm leading-6 text-ink-600">
          {card.traditionalMeaning}
        </p>
      )}
    </article>
  )
}
