import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import { DrawnCardDisplay } from '../components/DrawnCardDisplay'
import { ResultSection } from '../components/ResultSection'
import type { CompletedReading } from '../types/flow'

interface ResultPageProps {
  reading: CompletedReading
  onHome: () => void
}

type CopyState = 'idle' | 'copied' | 'failed'

export function ResultPage({ reading, onHome }: ResultPageProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const { input, output } = reading

  async function handleCopy() {
    const cardList = input.drawnCards
      .map(
        ({ card, orientation, position }) =>
          `${card.nameEn} — ${orientation}${position ? ` (${position})` : ''}`,
      )
      .join('\n')
    const readingText = [
      output.summary,
      '',
      cardList,
      '',
      output.interpretation,
      '',
      output.actionSuggestion,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(readingText)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-plum-500">
          Your reflection
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-plum-950 sm:text-5xl">
          A message for this moment
        </h1>
      </div>

      <section className="relative mt-8 overflow-hidden rounded-card border border-gold-300 bg-gold-100 p-6 text-center shadow-soft sm:p-8">
        <span className="absolute -right-3 -top-5 text-7xl text-gold-300/60" aria-hidden="true">
          ✦
        </span>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-plum-600">
          In one sentence
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-serif text-xl leading-8 text-plum-950 sm:text-2xl">
          {output.summary}
        </p>
      </section>

      <section className={`mt-8 grid gap-4 ${input.drawnCards.length === 3 ? 'sm:grid-cols-3' : 'mx-auto max-w-xs'}`}>
        {input.drawnCards.map((drawnCard) => (
          <DrawnCardDisplay key={`${drawnCard.card.id}-${drawnCard.position ?? 'single'}`} drawnCard={drawnCard} />
        ))}
      </section>

      <div className="mt-8 grid gap-4">
        <ResultSection eyebrow="The cards suggest" title="A possible perspective">
          <p>{output.interpretation}</p>
        </ResultSection>
        <div className="grid gap-4 md:grid-cols-2">
          <ResultSection eyebrow="A gentle note" title="You are allowed to take your time">
            <p>{output.emotionalSupport}</p>
          </ResultSection>
          <ResultSection eyebrow="A small next step" title="Something you could try">
            <p>{output.actionSuggestion}</p>
          </ResultSection>
        </div>
      </div>

      <section className="mt-8 rounded-card bg-plum-900 p-6 text-cream-50 sm:p-8">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-300">
          Keep reflecting
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold">
          Questions to carry with you
        </h2>
        <div className="mt-5 grid gap-3">
          {output.followUpPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm leading-6 transition hover:border-gold-300/60 hover:bg-white/10"
            >
              <span className="mr-2 text-gold-300">→</span>
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <SecondaryButton onClick={handleCopy}>
          <span aria-hidden="true">⧉</span>{' '}
          {copyState === 'copied'
            ? 'Copied'
            : copyState === 'failed'
              ? 'Copy unavailable'
              : 'Copy reading'}
        </SecondaryButton>
        <PrimaryButton onClick={onHome}>Return home</PrimaryButton>
      </div>

      <p className="mx-auto mt-10 max-w-2xl border-t border-plum-100 pt-6 text-center text-xs leading-5 text-ink-400">
        This reading is not a deterministic prediction. It is for self-reflection
        and emotional support only.
      </p>
    </div>
  )
}
