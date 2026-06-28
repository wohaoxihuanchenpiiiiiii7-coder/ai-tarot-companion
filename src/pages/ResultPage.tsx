import { useState } from 'react'
import { BilingualLabel } from '../components/BilingualLabel'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import { DrawnCardDisplay } from '../components/DrawnCardDisplay'
import { ResultSection } from '../components/ResultSection'
import { copy } from '../content/copy'
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
      .map(({ card, orientation, position }) => {
        const orientationLabel = copy.orientations[orientation].zh
        const positionLabel = position ? `（${copy.positions[position].zh}）` : ''

        return `${card.nameZh} · ${orientationLabel}${positionLabel}`
      })
      .join('\n')
    const readingText = [
      output.summary,
      '',
      cardList,
      '',
      output.interpretation,
      '',
      output.actionSuggestion,
      '',
      copy.result.disclaimer,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(readingText)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const copyButtonLabel =
    copyState === 'copied'
      ? copy.result.copied
      : copyState === 'failed'
        ? copy.result.copyUnavailable
        : copy.result.copyReading

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <h1>
          <BilingualLabel
            {...copy.result.pageTitle}
            variant="pageTitle"
            align="center"
          />
        </h1>
      </div>

      <section className="relative mt-8 overflow-hidden rounded-card border border-gold-300 bg-gold-100 p-6 text-center shadow-soft sm:p-8">
        <span
          className="absolute -right-3 -top-5 text-7xl text-gold-300/60"
          aria-hidden="true"
        >
          ✦
        </span>
        <h2>
          <BilingualLabel
            {...copy.result.keyMessage}
            variant="sectionTitle"
            align="center"
          />
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-9 text-plum-950 sm:text-2xl">
          {output.summary}
        </p>
      </section>

      <section className="mt-8">
        <h2>
          <BilingualLabel
            {...copy.result.drawnCards}
            variant="sectionTitle"
            align="center"
          />
        </h2>
        <div
          className={`mt-5 grid gap-4 ${
            input.drawnCards.length === 3
              ? 'sm:grid-cols-3'
              : 'mx-auto max-w-xs'
          }`}
        >
          {input.drawnCards.map((drawnCard) => (
            <DrawnCardDisplay
              key={`${drawnCard.card.id}-${drawnCard.position ?? 'single'}`}
              drawnCard={drawnCard}
            />
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4">
        <ResultSection label={copy.result.personalizedReading}>
          <p>{output.interpretation}</p>
        </ResultSection>
        <div className="grid gap-4 md:grid-cols-2">
          <ResultSection label={copy.result.emotionalSupport}>
            <p>{output.emotionalSupport}</p>
          </ResultSection>
          <ResultSection label={copy.result.actionStep}>
            <p>{output.actionSuggestion}</p>
          </ResultSection>
        </div>
      </div>

      <section className="mt-8 rounded-card bg-plum-900 p-6 text-cream-50 sm:p-8">
        <h2>
          <BilingualLabel
            {...copy.result.continueExploring}
            variant="sectionTitle"
            tone="gold"
          />
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
        <SecondaryButton onClick={handleCopy} className="gap-3">
          <span aria-hidden="true">⧉</span>
          <BilingualLabel
            {...copyButtonLabel}
            variant="button"
            align="center"
          />
        </SecondaryButton>
        <PrimaryButton onClick={onHome}>
          <BilingualLabel
            {...copy.result.backHome}
            variant="button"
            tone="inverse"
            align="center"
          />
        </PrimaryButton>
      </div>

      <p className="mx-auto mt-10 max-w-2xl border-t border-plum-100 pt-6 text-center text-xs leading-6 text-ink-400">
        {copy.result.disclaimer}
      </p>
    </div>
  )
}
